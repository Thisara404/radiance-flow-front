const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a class name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  instructor: {
    type: String,
    required: [true, 'Please add an instructor name']
  },
  level: {
    type: String,
    required: [true, 'Please specify the class level'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
  },
  schedule: {
    type: String,
    required: [true, 'Please add a class schedule']
  },
  duration: {
    type: String,
    default: '60 min'
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  capacity: {
    type: Number,
    default: 20
  },
  enrollments: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to trim description if it exceeds max length
ClassSchema.pre('validate', function(next) {
  if (this.description && this.description.length > 500) {
    this.description = this.description.substring(0, 500);
  }
  next();
});

module.exports = mongoose.model('Class', ClassSchema);