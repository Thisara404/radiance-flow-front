const Class = require('../models/Class');
const Enrollment = require('../models/Enrollment');

// Add this debug function to the controller
const debugClass = (cls) => {
  return {
    id: cls._id,
    name: cls.name,
    instructor: cls.instructor,
    level: cls.level,
    schedule: cls.schedule,
    duration: cls.duration,
    price: cls.price,
    capacity: cls.capacity,
    enrollments: cls.enrollments,
    description: cls.description ? `${cls.description.substring(0, 50)}...` : 'No description'
  };
};

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public
exports.getClasses = async (req, res) => {
  try {
    console.log('Fetching all classes...');
    const classes = await Class.find().sort({ createdAt: -1 });
    
    console.log(`Found ${classes.length} classes`);
    if (classes.length > 0) {
      console.log('Sample class data:', debugClass(classes[0]));
    }
    
    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching classes'
    });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Public
exports.getClass = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id)
      .populate('instructor', 'name specialty');

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: `Class not found with id of ${req.params.id}`
      });
    }

    // Get enrollment count
    const enrolledCount = await Enrollment.countDocuments({ 
      class: classObj._id,
      status: { $in: ['active', 'pending'] }
    });
    
    const result = classObj.toObject();
    result.enrolledCount = enrolledCount;
    result.availableSpots = classObj.capacity - enrolledCount;

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private/Admin
exports.createClass = async (req, res) => {
  try {
    console.log('Creating new class with data:', req.body);
    
    // Validate description length
    if (req.body.description && req.body.description.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Description cannot be more than 500 characters'
      });
    }
    
    // Ensure price is a number
    if (req.body.price) {
      req.body.price = Number(req.body.price);
      if (isNaN(req.body.price)) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid number'
        });
      }
    }
    
    // Ensure capacity is a number
    if (req.body.capacity) {
      req.body.capacity = Number(req.body.capacity);
      if (isNaN(req.body.capacity)) {
        return res.status(400).json({
          success: false,
          message: 'Capacity must be a valid number'
        });
      }
    }
    
    // Create the class
    const newClass = await Class.create(req.body);
    
    console.log('Class created successfully:', newClass);
    
    res.status(201).json({
      success: true,
      data: newClass
    });
  } catch (error) {
    console.error('Error creating class:', error);
    
    // Provide detailed validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating class'
    });
  }
};

// @desc    Enroll student in a class
// @route   POST /api/classes/:id/enroll
// @access  Private (Student)
exports.enrollStudent = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    
    if (!cls) {
      return res.status(404).json({
        success: false,
        message: `Class not found with id of ${req.params.id}`
      });
    }
    
    const student = await User.findById(req.user.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if class is full
    if (cls.enrolledStudents && cls.enrolledStudents.length >= cls.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Class is already at full capacity'
      });
    }

    // Check if student is already enrolled in this class
    if (cls.enrolledStudents && cls.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this class'
      });
    }

    // Create enrollment record
    const enrollment = await Enrollment.create({
      student: req.user.id,
      class: cls._id,
      status: 'Active',
      paymentStatus: 'Pending' // Default to pending, can be updated later
    });

    // Add student to enrolled students array
    cls.enrolledStudents = cls.enrolledStudents || [];
    cls.enrolledStudents.push(req.user.id);
    await cls.save();

    res.status(200).json({
      success: true,
      data: enrollment,
      message: 'Successfully enrolled in class'
    });
  } catch (error) {
    console.error('Error enrolling in class:', error);
    
    // Check if this is a duplicate key error (already enrolled)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this class'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get classes a student is enrolled in
// @route   GET /api/classes/enrolled
// @access  Private (Student)
exports.getEnrolledClasses = async (req, res) => {
  try {
    console.log('Getting enrolled classes for user:', req.user.id);
    
    // Find enrollments for this student
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'class',
        populate: {
          path: 'instructor',
          select: 'name specialty experience'
        }
      });

    // Map enrollments to classes with enrollment info
    const classes = enrollments.map(enrollment => {
      // Make sure enrollment.class exists before accessing properties
      if (!enrollment.class) {
        return null;
      }
      
      return {
        _id: enrollment.class._id,
        id: enrollment.class._id,
        name: enrollment.class.name,
        level: enrollment.class.level,
        schedule: enrollment.class.schedule,
        duration: enrollment.class.duration,
        price: enrollment.class.price,
        description: enrollment.class.description,
        instructor: enrollment.class.instructor ? {
          name: enrollment.class.instructor.name,
          specialty: enrollment.class.instructor.specialty
        } : null,
        capacity: enrollment.class.capacity,
        enrollmentId: enrollment._id,
        enrollmentStatus: enrollment.status,
        paymentStatus: enrollment.paymentStatus,
        enrollmentDate: enrollment.enrollmentDate
      };
    }).filter(Boolean); // Remove any null entries

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    console.error('Error fetching enrolled classes:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get students enrolled in a class
// @route   GET /api/classes/:id/students
// @access  Private/Admin
exports.getEnrolledStudents = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id)
      .populate({
        path: 'enrolledStudents',
        select: 'name email'
      });

    if (!cls) {
      return res.status(404).json({
        success: false,
        message: `Class not found with id of ${req.params.id}`
      });
    }

    // Get more detailed enrollment information
    const enrollments = await Enrollment.find({
      class: req.params.id
    }).populate({
      path: 'student',
      select: 'name email'
    });

    const students = enrollments.map(enrollment => ({
      id: enrollment.student._id,
      name: enrollment.student.name,
      email: enrollment.student.email,
      status: enrollment.status,
      paymentStatus: enrollment.paymentStatus,
      enrollmentDate: enrollment.enrollmentDate,
      enrollmentId: enrollment._id
    }));

    res.status(200).json({
      success: true,
      count: students.length,
      classCapacity: cls.capacity,
      data: students
    });
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private/Admin
exports.updateClass = async (req, res) => {
  try {
    console.log('Updating class with ID:', req.params.id);
    console.log('Update data:', req.body);
    
    // Find the class first to check if it exists
    const classExists = await Class.findById(req.params.id);
    
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: `Class not found with id of ${req.params.id}`
      });
    }
    
    // Update the class
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true // Run validation on update
      }
    );
    
    res.status(200).json({
      success: true,
      data: updatedClass
    });
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating class'
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
exports.deleteClass = async (req, res) => {
  try {
    const classToDelete = await Class.findById(req.params.id);
    
    if (!classToDelete) {
      return res.status(404).json({
        success: false,
        message: `Class not found with id of ${req.params.id}`
      });
    }
    
    // Delete related enrollments first if needed
    // await Enrollment.deleteMany({ class: req.params.id });
    
    // Delete the class
    await classToDelete.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Class deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting class'
    });
  }
};