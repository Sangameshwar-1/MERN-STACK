const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    invitedAt: { type: Date, default: Date.now }
  }],
  inviteCode: {
    type: String,
    required: true,
    unique: true
  },
  maxSize: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['forming', 'complete', 'cancelled'],
    default: 'forming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
