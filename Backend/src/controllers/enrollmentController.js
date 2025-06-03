const Enrollment = require('../models/Enrollment');
const Class = require('../models/Class');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Enroll a student in a class
// @route   POST /api/enrollments
// @access  Private
exports.enrollInClass = async (req, res) => {
  try {
    const { classId } = req.body;

    // Check if class exists
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      class: classId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this class'
      });
    }

    // Check if class is full
    const enrollmentCount = await Enrollment.countDocuments({ 
      class: classId,
      status: { $in: ['active', 'pending'] }
    });

    if (enrollmentCount >= classObj.capacity) {
      return res.status(400).json({
        success: false,
        message: 'This class is full'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      class: classId
    });

    // Populate student and class details
    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('student', 'name email')
      .populate('class', 'name level schedule');

    res.status(201).json({
      success: true,
      data: populatedEnrollment
    });
  } catch (error) {
    console.error('Error enrolling in class:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all enrollments for a class
// @route   GET /api/classes/:classId/enrollments
// @access  Private/Admin
exports.getClassEnrollments = async (req, res) => {
  try {
    const { classId } = req.params;

    // Check if class exists
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const enrollments = await Enrollment.find({ class: classId })
      .populate('student', 'name email createdAt')
      .sort({ enrollmentDate: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    console.error('Error getting class enrollments:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all enrollments for current user (student)
// @route   GET /api/enrollments/me
// @access  Private
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'class',
        select: 'name level schedule instructor',
        populate: { 
          path: 'instructor', 
          select: 'name' 
        }
      })
      .sort({ enrollmentDate: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    console.error('Error getting my enrollments:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update enrollment status
// @route   PUT /api/enrollments/:id
// @access  Private/Admin
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'completed', 'dropped', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    .populate('student', 'name email')
    .populate('class', 'name level schedule');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all enrollments (admin only)
// @route   GET /api/enrollments
// @access  Private/Admin
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('class', 'name level schedule instructor')
      .sort({ enrollmentDate: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    console.error('Error getting all enrollments:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};