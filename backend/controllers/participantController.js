const User = require('../models/User');
const PasswordResetRequest = require('../models/PasswordResetRequest');

// @desc    Get participant profile
// @route   GET /api/participants/profile
// @access  Private (participant)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('followedClubs', 'name category');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update participant profile
// @route   PUT /api/participants/profile
// @access  Private (participant)
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, contactNumber, collegeOrOrg, interests, followedClubs } = req.body;
    const user = await User.findById(req.user._id);

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.contactNumber = contactNumber || user.contactNumber;
    user.collegeOrOrg = collegeOrOrg || user.collegeOrOrg;
    if (interests !== undefined) user.interests = interests;
    if (followedClubs !== undefined) user.followedClubs = followedClubs;

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/participants/change-password
// @access  Private (participant)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all organizers (for following)
// @route   GET /api/participants/organizers
// @access  Private (participant)
const getOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: 'organizer', isActive: true })
      .select('name category description')
      .sort({ name: 1 });
    res.json(organizers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Organizer requests password reset
// @route   POST /api/participants/request-password-reset (organizer route)
// @access  Private (organizer)
const requestPasswordReset = async (req, res) => {
  try {
    const { reason } = req.body;
    const existing = await PasswordResetRequest.findOne({ organizer: req.user._id, status: 'pending' });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending password reset request' });
    }
    const resetReq = await PasswordResetRequest.create({ organizer: req.user._id, reason });
    res.status(201).json({ message: 'Password reset request submitted to Admin', request: resetReq });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword, getOrganizers, requestPasswordReset };
