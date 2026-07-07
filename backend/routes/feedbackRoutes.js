const express = require('express');
const router = express.Router();
const { submitFeedback, getEventFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/:eventId', protect, authorizeRoles('participant'), submitFeedback);
router.get('/:eventId', protect, authorizeRoles('organizer', 'admin'), getEventFeedback);

module.exports = router;
