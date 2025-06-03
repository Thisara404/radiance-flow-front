const express = require('express');
const { 
  getInstructors, 
  getInstructor, 
  createInstructor
} = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getInstructors)
  .post(protect, authorize('admin'), createInstructor);

router.route('/:id')
  .get(getInstructor);

module.exports = router;