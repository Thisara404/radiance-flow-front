const Payment = require('../models/Payment');

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private/Admin
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payments for a student
// @route   GET /api/payments
// @access  Private
exports.getStudentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.id });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/payments/:id
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status'
      });
    }

    let payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: `Payment not found with id of ${req.params.id}`
      });
    }

    payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payments (admin only)
// @route   GET /api/payments/all
// @access  Private/Admin
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('student', 'name email');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};