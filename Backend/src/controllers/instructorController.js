const Instructor = require('../models/Instructor');

// @desc    Get all instructors
// @route   GET /api/instructors
// @access  Public
exports.getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    
    res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors
    });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single instructor
// @route   GET /api/instructors/:id
// @access  Public
exports.getInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: `Instructor not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: instructor
    });
  } catch (error) {
    console.error('Error fetching instructor:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new instructor
// @route   POST /api/instructors
// @access  Private/Admin
exports.createInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.create(req.body);

    res.status(201).json({
      success: true,
      data: instructor
    });
  } catch (error) {
    console.error('Error creating instructor:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update instructor
// @route   PUT /api/instructors/:id
// @access  Private/Admin
exports.updateInstructor = async (req, res) => {
  try {
    let instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: `Instructor not found with id of ${req.params.id}`
      });
    }

    instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: instructor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete instructor
// @route   DELETE /api/instructors/:id
// @access  Private/Admin
exports.deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: `Instructor not found with id of ${req.params.id}`
      });
    }

    await instructor.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};