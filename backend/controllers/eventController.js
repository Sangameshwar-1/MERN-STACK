const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const cachex = require('../utils/cachex');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (organizer)
const createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user._id });
    
    // Invalidate CacheX
    await cachex.clear();

    // Post to Discord webhook if configured
    const organizer = await User.findById(req.user._id);
    if (organizer.discordWebhook) {
      try {
        const fetch = (await import('node-fetch')).default;
        await fetch(organizer.discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🎉 New Event: **${event.eventName}**\nType: ${event.eventType}\nDeadline: ${new Date(event.registrationDeadline).toLocaleDateString()}`
          })
        });
      } catch (e) {
        console.error('Discord webhook error:', e.message);
      }
    }

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events (with search/filter)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { search, eventType, eligibility, startDate, endDate, followedClubs, page = 1, limit = 12 } = req.query;
    
    // CacheX Check
    const cacheKey = `events_${page}_${limit}_${search||''}_${eventType||''}_${eligibility||''}_${startDate||''}_${endDate||''}_${followedClubs||''}`;
    const cachedData = await cachex.getJSON(cacheKey);
    if (cachedData) {
      console.log('[CacheX] HIT:', cacheKey);
      return res.json(cachedData);
    }
    console.log('[CacheX] MISS:', cacheKey);

    let query = { isActive: true };

    // Text search
    if (search) {
      query.$or = [
        { eventName: { $regex: search, $options: 'i' } },
        { eventDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filters
    if (eventType) query.eventType = eventType;
    if (eligibility) query.eligibility = { $in: [eligibility, 'all'] };
    if (startDate || endDate) {
      query.eventStartDate = {};
      if (startDate) query.eventStartDate.$gte = new Date(startDate);
      if (endDate) query.eventStartDate.$lte = new Date(endDate);
    }
    if (followedClubs === 'true' && req.user) {
      const user = await User.findById(req.user._id);
      query.organizer = { $in: user.followedClubs };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Event.countDocuments(query);
    
    const events = await Event.find(query)
      .populate('organizer', 'name category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const responseData = { events, total, page: parseInt(page), pages: Math.ceil(total / limit) };
    
    // Save to CacheX (TTL: 60s)
    await cachex.set(cacheKey, responseData, 60);

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending events (top 5 by views in last 24h)
// @route   GET /api/events/trending
// @access  Public
const getTrendingEvents = async (req, res) => {
  try {
    const cacheKey = 'trending_events';
    const cachedData = await cachex.getJSON(cacheKey);
    if (cachedData) {
      console.log('[CacheX] HIT:', cacheKey);
      return res.json(cachedData);
    }
    console.log('[CacheX] MISS:', cacheKey);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const trending = await Event.find({ isActive: true, updatedAt: { $gte: oneDayAgo } })
      .populate('organizer', 'name category')
      .sort({ viewCount: -1 })
      .limit(5);
      
    await cachex.set(cacheKey, trending, 120); // Cache for 2 mins
    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const cacheKey = `event_${req.params.id}`;
    const cachedData = await cachex.getJSON(cacheKey);
    if (cachedData) {
      console.log('[CacheX] HIT:', cacheKey);
      
      // Still need to update view count in bg
      Event.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }).exec();
      
      return res.json(cachedData);
    }
    console.log('[CacheX] MISS:', cacheKey);

    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name category description contactEmail');

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Increment view count
    event.viewCount += 1;
    await event.save();

    await cachex.set(cacheKey, event, 300); // 5 mins
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (organizer - own events)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Lock form if already has registrations
    if (req.body.customForm && event.formLocked) {
      return res.status(400).json({ message: 'Form is locked as registrations have been received' });
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Invalidate caches
    await cachex.del(`event_${req.params.id}`);
    await cachex.del('trending_events');
    await cachex.clear(); // Safest approach for pagination cache

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (organizer)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await event.deleteOne();
    
    // Invalidate caches
    await cachex.del(`event_${req.params.id}`);
    await cachex.clear();

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get events by organizer
// @route   GET /api/events/organizer/my-events
// @access  Private (organizer)
const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get organizer dashboard stats
// @route   GET /api/events/organizer/dashboard
// @access  Private (organizer)
const getOrganizerDashboard = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    const totalEvents = events.length;
    const totalParticipants = events.reduce((acc, ev) => acc + (ev.currentRegistrations || 0), 0);
    const totalRevenue = events.reduce((acc, ev) => acc + ((ev.currentRegistrations || 0) * (ev.registrationFee || 0)), 0);
    
    res.json({
      stats: {
        totalEvents,
        totalParticipants,
        totalRevenue
      },
      recentEvents: events.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEvent, getEvents, getTrendingEvents, getEventById, updateEvent, deleteEvent, getOrganizerEvents, getOrganizerDashboard };
