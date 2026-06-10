const express = require('express');
const router = express.Router();
const { registerParticipant, loginUser, getMe, completeOnboarding } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerParticipant);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/onboarding', protect, completeOnboarding);

module.exports = router;
