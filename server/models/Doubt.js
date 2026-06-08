const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: [true, 'Session ID is required']
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  answer: {
    type: String,
    trim: true
  },
  resolved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
doubtSchema.index({ studentId: 1 });
doubtSchema.index({ sessionId: 1 });
doubtSchema.index({ resolved: 1 });

module.exports = mongoose.model('Doubt', doubtSchema);
