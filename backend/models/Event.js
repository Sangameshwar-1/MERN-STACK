const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  fieldType: {
    type: String,
    enum: ['text', 'number', 'email', 'dropdown', 'checkbox', 'file', 'textarea'],
    required: true
  },
  label: { type: String, required: true },
  options: [{ type: String }], // for dropdown/checkbox
  required: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
});

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  eventDescription: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['normal', 'merchandise'],
    required: true
  },
  eligibility: {
    type: String,
    enum: ['all', 'iiit-only', 'non-iiit-only'],
    default: 'all'
  },
  eventStartDate: {
    type: Date,
    required: true
  },
  eventEndDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  registrationFee: {
    type: Number,
    default: 0
  },
  registrationLimit: {
    type: Number,
    default: null
  },
  currentRegistrations: {
    type: Number,
    default: 0
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{ type: String }],
  // Normal event fields
  customForm: [formFieldSchema],
  formLocked: {
    type: Boolean,
    default: false
  },
  // Merchandise event fields
  items: [{
    itemName: String,
    sizes: [String],
    colors: [String],
    stockQuantity: Number,
    price: Number,
    purchaseLimitPerParticipant: { type: Number, default: 1 }
  }],
  // Attendance tracking
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  // Team event support
  isTeamEvent: {
    type: Boolean,
    default: false
  },
  minTeamSize: {
    type: Number,
    default: 1
  },
  maxTeamSize: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Index for search
eventSchema.index({ eventName: 'text', eventDescription: 'text', tags: 'text' });

module.exports = mongoose.model('Event', eventSchema);
