const express = require('express');
const router = express.Router();
const {
  createEvent, getEvents, getTrendingEvents, getEventById,
  updateEvent, deleteEvent, getOrganizerEvents, getOrganizerDashboard
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', getEvents);
router.get('/trending', getTrendingEvents);
router.get('/organizer/my-events', protect, authorizeRoles('organizer'), getOrganizerEvents);
router.get('/organizer/dashboard', protect, authorizeRoles('organizer'), getOrganizerDashboard);
router.get('/:id', getEventById);
router.post('/', protect, authorizeRoles('organizer'), createEvent);
router.put('/:id', protect, authorizeRoles('organizer'), updateEvent);
router.delete('/:id', protect, authorizeRoles('organizer', 'admin'), deleteEvent);

module.exports = router;
