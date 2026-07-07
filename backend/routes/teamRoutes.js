const express = require('express');
const router = express.Router();
const { createTeam, joinTeam, getTeam, getMyTeams } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, authorizeRoles('participant'), createTeam);
router.post('/join', protect, authorizeRoles('participant'), joinTeam);
router.get('/my', protect, getMyTeams);
router.get('/:id', protect, getTeam);

module.exports = router;
