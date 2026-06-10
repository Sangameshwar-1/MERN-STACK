const express = require('express');
const router = express.Router();
const {
  registerForEvent, getMyRegistrations, getTicketById,
  getEventRegistrations, markAttendance, exportAttendanceCSV
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/register', protect, authorizeRoles('participant'), registerForEvent);
router.get('/my', protect, authorizeRoles('participant'), getMyRegistrations);
router.get('/ticket/:ticketId', protect, getTicketById);
router.get('/event/:eventId', protect, authorizeRoles('organizer', 'admin'), getEventRegistrations);
router.post('/attendance', protect, authorizeRoles('organizer'), markAttendance);
router.get('/event/:eventId/attendance-csv', protect, authorizeRoles('organizer'), exportAttendanceCSV);

module.exports = router;
