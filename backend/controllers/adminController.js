const User = require('../models/User');
const { generatePassword } = require('../utils/generatePassword');
const { sendOrganizerCredentials, sendPasswordResetEmail } = require('../utils/emailService');
const PasswordResetRequest = require('../models/PasswordResetRequest');
const cachex = require('../utils/cachex');

// @desc    Create organizer account (admin only)
// @route   POST /api/admin/organizers
// @access  Private (admin)
const createOrganizer = async (req, res) => {
  try {
    const { name, category, description, contactEmail } = req.body;

    // Auto-generate email and password
    const loginEmail = `${name.toLowerCase().replace(/\s+/g, '.')}.org@felicity.com`;
    const password = generatePassword(12);

    const existingUser = await User.findOne({ email: loginEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An organizer with this name already exists' });
    }

    const organizer = await User.create({
      name,
      email: loginEmail,
      password,
      role: 'organizer',
      category,
      description,
      contactEmail,
      isActive: true
    });

    // Send credentials to admin (who shares with organizer)
    try {
      await sendOrganizerCredentials({
        to: req.user.email,
        organizerName: name,
        loginEmail,
        password
      });
    } catch (e) {
      console.error('Email error:', e.message);
    }
    
    // Invalidate caches
    await cachex.del('admin_organizers');
    await cachex.del('admin_stats');

    res.status(201).json({
      message: 'Organizer created successfully. Credentials sent to your email.',
      organizer: {
        _id: organizer._id,
        name: organizer.name,
        email: organizer.email,
        category: organizer.category
      },
      credentials: { loginEmail, password } // also return in response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all organizers
// @route   GET /api/admin/organizers
// @access  Private (admin)
const getAllOrganizers = async (req, res) => {
  try {
    const cacheKey = 'admin_organizers';
    const cached = await cachex.getJSON(cacheKey);
    if (cached) return res.json(cached);

    const organizers = await User.find({ role: 'organizer' }).select('-password').sort({ createdAt: -1 });
    
    await cachex.set(cacheKey, organizers, 120);
    res.json(organizers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Disable/enable organizer
// @route   PUT /api/admin/organizers/:id/toggle
// @access  Private (admin)
const toggleOrganizerStatus = async (req, res) => {
  try {
    const organizer = await User.findById(req.params.id);
    if (!organizer || organizer.role !== 'organizer') {
      return res.status(404).json({ message: 'Organizer not found' });
    }
    organizer.isActive = !organizer.isActive;
    await organizer.save();
    
    await cachex.del('admin_organizers');
    
    res.json({ message: `Organizer ${organizer.isActive ? 'enabled' : 'disabled'}`, isActive: organizer.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete organizer permanently
// @route   DELETE /api/admin/organizers/:id
// @access  Private (admin)
const deleteOrganizer = async (req, res) => {
  try {
    const organizer = await User.findById(req.params.id);
    if (!organizer || organizer.role !== 'organizer') {
      return res.status(404).json({ message: 'Organizer not found' });
    }
    await organizer.deleteOne();
    
    await cachex.del('admin_organizers');
    await cachex.del('admin_stats');
    
    res.json({ message: 'Organizer deleted permanently' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all password reset requests
// @route   GET /api/admin/password-resets
// @access  Private (admin)
const getPasswordResetRequests = async (req, res) => {
  try {
    const cacheKey = 'admin_password_resets';
    const cached = await cachex.getJSON(cacheKey);
    if (cached) return res.json(cached);

    const requests = await PasswordResetRequest.find()
      .populate('organizer', 'name email category')
      .sort({ createdAt: -1 });
      
    await cachex.set(cacheKey, requests, 120);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or reject password reset request
// @route   PUT /api/admin/password-resets/:id
// @access  Private (admin)
const handlePasswordResetRequest = async (req, res) => {
  try {
    const { action, adminComment } = req.body; // action: 'approve' | 'reject'

    const resetReq = await PasswordResetRequest.findById(req.params.id).populate('organizer');
    if (!resetReq) return res.status(404).json({ message: 'Request not found' });

    if (action === 'approve') {
      const newPassword = generatePassword(10);
      const organizer = await User.findById(resetReq.organizer._id);
      organizer.password = newPassword;
      await organizer.save();

      resetReq.status = 'approved';
      resetReq.adminComment = adminComment || '';
      resetReq.resolvedAt = new Date();
      await resetReq.save();

      // Send new password to admin
      try {
        await sendPasswordResetEmail({
          to: req.user.email,
          organizerName: organizer.name,
          newPassword
        });
      } catch (e) {
        console.error('Email error:', e.message);
      }

      await cachex.del('admin_password_resets');
      await cachex.del('admin_stats');
      res.json({ message: 'Password reset approved. New password sent to admin email.', newPassword });
    } else {
      resetReq.status = 'rejected';
      resetReq.adminComment = adminComment || '';
      resetReq.resolvedAt = new Date();
      await resetReq.save();
      
      await cachex.del('admin_password_resets');
      await cachex.del('admin_stats');
      res.json({ message: 'Password reset request rejected.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (admin)
const getAdminStats = async (req, res) => {
  try {
    const cacheKey = 'admin_stats';
    const cached = await cachex.getJSON(cacheKey);
    if (cached) return res.json(cached);

    const Event = require('../models/Event');
    const Registration = require('../models/Registration');
    
    const [totalOrganizers, totalParticipants, totalEvents, totalRegistrations, pendingResets] = await Promise.all([
      User.countDocuments({ role: 'organizer' }),
      User.countDocuments({ role: 'participant' }),
      Event.countDocuments({ isActive: true }),
      Registration.countDocuments(),
      PasswordResetRequest.countDocuments({ status: 'pending' })
    ]);

    const stats = { totalOrganizers, totalParticipants, totalEvents, totalRegistrations, pendingResets };
    await cachex.set(cacheKey, stats, 300); // 5 mins
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const seedDatabase = async (req, res) => {
  try {
    const Event = require('../models/Event');
    const Registration = require('../models/Registration');
    const Team = require('../models/Team');
    
    const EVENT_NAMES = [
      "CodeSprint 2026", "RoboWars", "Hackathon Alpha", "Music Fest '26", 
      "AI Symposium", "Gaming Tournament", "WebDev Bootcamp", "StartUp Pitch", 
      "Photography Contest", "Dance Battle", "Literature Fest", "Debate Championship",
      "Designathon", "Treasure Hunt", "VR Experience", "CyberSecurity Workshop"
    ];

    const IMAGES = [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420"
    ];

    // Clear everything except admin
    await Event.deleteMany({});
    await User.deleteMany({ role: { $ne: 'admin' } });
    await Registration.deleteMany({});
    await Team.deleteMany({});

    // 1. Create Organizers
    const organizers = [];
    for(let i = 1; i <= 5; i++) {
      const org = await User.create({
        name: `Tech Club ${i}`,
        email: `techclub${i}@felicity.com`,
        password: 'password123',
        role: 'organizer',
        isActive: true,
        onboardingComplete: true
      });
      organizers.push(org);
    }

    // 2. Create Participants
    const participants = [];
    for(let i = 1; i <= 20; i++) {
      const p = await User.create({
        firstName: `Participant`,
        lastName: `${i}`,
        email: `student${i}@college.edu`,
        password: 'password123',
        role: 'participant',
        participantType: i % 2 === 0 ? 'iiit' : 'non-iiit',
        isActive: true,
        onboardingComplete: true
      });
      participants.push(p);
    }

    // 3. Create Events
    const events = [];
    for (let i = 0; i < 30; i++) {
      const org = organizers[Math.floor(Math.random() * organizers.length)];
      const now = new Date();
      const start = new Date(now.getTime() + (Math.random() * 30 - 5) * 24 * 60 * 60 * 1000); 
      const end = new Date(start.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000); 
      const deadline = new Date(start.getTime() - 2 * 24 * 60 * 60 * 1000); 
      const img = IMAGES[Math.floor(Math.random() * IMAGES.length)];
      
      const event = await Event.create({
        eventName: `${EVENT_NAMES[Math.floor(Math.random() * EVENT_NAMES.length)]} - Edition ${i+1}`,
        eventDescription: `This is a massively scaled, automatically generated event with tons of amazing activities, prizes, and fun! Join us for edition ${i+1}.`,
        eventType: Math.random() > 0.8 ? 'merchandise' : 'normal',
        eligibility: ['all', 'iiit-only', 'non-iiit-only'][Math.floor(Math.random() * 3)],
        eventStartDate: start,
        eventEndDate: end,
        registrationDeadline: deadline,
        registrationFee: Math.floor(Math.random() * 5) * 100,
        organizer: org._id,
        posterUrl: img,
        bannerUrl: img,
        tags: ["tech", "fun", "college"],
        viewCount: Math.floor(Math.random() * 1000),
        isActive: true
      });
      events.push(event);
    }

    // 4. Create Registrations
    for (const p of participants) {
      // Each participant registers for 3-5 random events
      const numReg = Math.floor(Math.random() * 3) + 3;
      const shuffledEvents = events.sort(() => 0.5 - Math.random()).slice(0, numReg);

      for (const ev of shuffledEvents) {
        await Registration.create({
          event: ev._id,
          participant: p._id,
          status: 'confirmed',
          registrationType: ev.eventType === 'merchandise' ? 'merchandise' : 'normal',
          paymentStatus: ev.registrationFee > 0 ? 'approved' : 'not-required'
        });
        await Event.findByIdAndUpdate(ev._id, { $inc: { currentRegistrations: 1 } });
      }
    }

    await cachex.clear();
    res.json({ message: 'Successfully seeded 5 organizers, 20 participants, 30 events, and hundreds of registrations!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrganizer, getAllOrganizers, toggleOrganizerStatus, deleteOrganizer, getPasswordResetRequests, handlePasswordResetRequest, getAdminStats, seedDatabase };
