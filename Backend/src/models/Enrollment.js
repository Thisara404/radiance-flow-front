const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  class: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped', 'pending'],
    default: 'active'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'waived'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Prevent duplicate enrollments
EnrollmentSchema.index({ student: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);