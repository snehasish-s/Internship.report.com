const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Session date is required']
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true
  },
  toolsUsed: {
    type: [String],
    default: []
  },
  learnings: {
    type: String,
    required: [true, 'Learnings are required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Hands-on Lab', 'Lecture', 'Tool Workshop', 'Project Review', 'Mentor Session'],
    required: [true, 'Session type is required']
  },
  durationHours: {
    type: Number,
    min: 0.5,
    max: 12,
    default: 1
  },
  mentor: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Rating is required']
  },
  confidenceLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  datasetUsed: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
sessionSchema.index({ userId: 1, date: -1 });
sessionSchema.index({ type: 1 });

module.exports = mongoose.model('Session', sessionSchema);
