const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  specialty: {
    type: String,
    required: [true, 'Please add a specialty']
  },
  experience: {
    type: String,
    required: [true, 'Please add years of experience']
  },
  bio: {
    type: String
  },
  classes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Class'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Instructor', instructorSchema);