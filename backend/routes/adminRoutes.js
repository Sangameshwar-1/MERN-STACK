const express = require('express');
const router = express.Router();
const {
  createOrganizer, getAllOrganizers, toggleOrganizerStatus,
  deleteOrganizer, getPasswordResetRequests, handlePasswordResetRequest, getAdminStats, seedDatabase
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/seed-fake-data', seedDatabase);

router.use(protect, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.post('/organizers', createOrganizer);
router.get('/organizers', getAllOrganizers);
router.put('/organizers/:id/toggle', toggleOrganizerStatus);
router.delete('/organizers/:id', deleteOrganizer);
router.get('/password-resets', getPasswordResetRequests);
router.put('/password-resets/:id', handlePasswordResetRequest);

module.exports = router;
