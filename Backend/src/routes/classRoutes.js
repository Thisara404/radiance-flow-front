const express = require("express");
const {
  getClasses,
  getClass,
  createClass,
  enrollStudent,
  updateClass,
  deleteClass,
  getEnrolledClasses,
  getEnrolledStudents,
} = require("../controllers/classController");
const { protect, authorize } = require("../middleware/auth");

// Import enrollment controller for class enrollments
const { getClassEnrollments } = require("../controllers/enrollmentController");

const router = express.Router();

// Public routes
router
  .route("/")
  .get(getClasses)
  .post(protect, authorize("admin"), createClass);

// Special routes must come BEFORE parameterized routes
router.route("/enrolled").get(protect, getEnrolledClasses);

// Protected routes for students
router.route("/:id/enroll").post(protect, enrollStudent);

// Admin routes for enrollments - This is the missing route
router.route("/:id/enrollments").get(protect, authorize("admin"), getClassEnrollments);

// Admin only routes
router.route("/:id/students").get(protect, authorize("admin"), getEnrolledStudents);

// Generic routes - these must come LAST to avoid conflicts
router
  .route("/:id")
  .get(getClass)
  .put(protect, authorize("admin"), updateClass)
  .delete(protect, authorize("admin"), deleteClass);

module.exports = router;
