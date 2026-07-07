const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'rejected', 'completed'],
    default: 'confirmed'
  },
  registrationType: {
    type: String,
    enum: ['normal', 'merchandise', 'team'],
    required: true
  },
  formResponses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  // Merchandise specific
  selectedItems: [{
    itemName: String,
    size: String,
    color: String,
    quantity: Number,
    price: Number
  }],
  paymentProof: {
    type: String // file path/URL
  },
  paymentStatus: {
    type: String,
    enum: ['not-required', 'pending', 'approved', 'rejected'],
    default: 'not-required'
  },
  // Team registration
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  attendanceMarked: {
    type: Boolean,
    default: false
  },
  attendanceTimestamp: Date
}, { timestamps: true });

// Prevent duplicate registration
registrationSchema.index({ event: 1, participant: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
