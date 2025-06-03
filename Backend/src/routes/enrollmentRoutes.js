const express = require('express');
const {
  enrollInClass,
  getClassEnrollments,
  getMyEnrollments,
  updateEnrollmentStatus,
  getAllEnrollments
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes that all authenticated users can access
router.post('/', enrollInClass);
router.get('/me', getMyEnrollments);

// Routes that only admins can access
router.get('/', authorize('admin'), getAllEnrollments);
router.put('/:id', authorize('admin'), updateEnrollmentStatus);

module.exports = router;