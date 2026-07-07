const express = require('express');
const router = express.Router();
const { getMessages, postMessage, deleteMessage, togglePin, reactToMessage } = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Attach io to req
router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

router.get('/:eventId', protect, getMessages);
router.post('/:eventId', protect, postMessage);
router.delete('/message/:id', protect, deleteMessage);
router.put('/message/:id/pin', protect, authorizeRoles('organizer', 'admin'), togglePin);
router.post('/message/:id/react', protect, reactToMessage);

module.exports = router;
