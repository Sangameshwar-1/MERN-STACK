const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
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
  qrCode: {
    type: String, // base64 QR image
    required: true
  },
  ticketType: {
    type: String,
    enum: ['normal', 'merchandise', 'team'],
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
