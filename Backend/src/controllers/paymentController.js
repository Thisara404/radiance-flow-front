const Payment = require('../models/Payment');
const PaymentService = require('../services/paymentService');
const Class = require('../models/Class');
const Event = require('../models/Event');

// @desc    Handle PayPal return
// @route   GET /api/payments/paypal/return
// @access  Public
exports.handlePayPalReturn = async (req, res) => {
  try {
    const { token, PayerID } = req.query;

    if (!token) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel?error=missing_token`);
    }

    console.log("Handling PayPal return with token:", token);

    // Capture the payment
    const result = await PaymentService.capturePaymentByToken(token);

    if (result.success) {
      const paymentId = result.data.paymentId;
      console.log("Redirecting to success page with payment ID:", paymentId);
      
      // Redirect to success page with payment ID
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/student-dashboard?payment=success&paymentId=${paymentId}&token=${token}`);
    } else {
      console.error("Payment capture failed:", result.error);
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel?error=${encodeURIComponent(result.error)}`);
    }
  } catch (error) {
    console.error('PayPal return handler error:', error);
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel?error=${encodeURIComponent(error.message)}`);
  }
};

// @desc    Handle PayPal cancel
// @route   GET /api/payments/paypal/cancel
// @access  Public
exports.handlePayPalCancel = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (token) {
      // Update payment status to cancelled
      await Payment.findOneAndUpdate(
        { paypalOrderId: token },
        { status: 'cancelled' }
      );
    }

    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel`);
  } catch (error) {
    console.error('PayPal cancel handler error:', error);
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel`);
  }
};

// @desc    Create payment order
// @route   POST /api/payments/create-order
// @access  Private
exports.createPaymentOrder = async (req, res) => {
  try {
    const { itemType, itemId, amount, description } = req.body;

    if (!itemType || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Item type and amount are required'
      });
    }

    // Validate item exists for class/event payments
    if (['class', 'event'].includes(itemType) && itemId) {
      const Model = itemType === 'class' ? Class : Event;
      const item = await Model.findById(itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: `${itemType} not found`
        });
      }
    }

    const result = await PaymentService.createPaymentOrder({
      userId: req.user.id,
      itemType,
      itemId,
      amount,
      description: description || `Payment for ${itemType}`,
      metadata: req.body.metadata || {}
    });

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Capture payment
// @route   POST /api/payments/capture/:orderId
// @access  Private
exports.capturePayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const result = await PaymentService.capturePayment(orderId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error capturing payment:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add the missing cancelMyPayment method
exports.cancelMyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find payment and verify it belongs to the user
    const payment = await Payment.findOne({ 
      _id: id, 
      user: req.user.id,
      status: 'pending' // Only allow cancelling pending payments
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pending payment not found or you are not authorized to cancel it'
      });
    }

    // Update payment status to cancelled
    payment.status = 'cancelled';
    await payment.save();

    res.status(200).json({
      success: true,
      data: payment,
      message: 'Payment cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling payment:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment slip
// @route   GET /api/payments/:id/slip
// @access  Private
exports.getPaymentSlip = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find payment
    const payment = await Payment.findById(id)
      .populate('user', 'name email')
      .populate('itemId', 'name');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization (user can view their own payments, admin can view all)
    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this payment'
      });
    }

    const result = await PaymentService.generatePaymentSlip(id);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error getting payment slip:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Refund payment
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
exports.refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await PaymentService.refundPayment(id, reason);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user payment history
// @route   GET /api/payments/my-history
// @access  Private
exports.getMyPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('itemId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payments (admin)
// @route   GET /api/payments/admin/all
// @access  Private/Admin
exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('user', 'name email')
      .populate('itemId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    // Calculate stats
    const stats = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amountLKR' },
          completedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$amountLKR', 0]
            }
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amountLKR', 0]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      data: payments,
      stats: stats[0] || { totalAmount: 0, completedAmount: 0, pendingAmount: 0 }
    });
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment statistics
// @route   GET /api/payments/admin/stats
// @access  Private/Admin
exports.getPaymentStats = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const stats = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amountLKR' }
        }
      }
    ]);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$amountLKR' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: daysBack,
        stats,
        monthlyRevenue: monthlyRevenue[0]?.revenue || 0
      }
    });
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Legacy methods for backward compatibility
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      user: req.body.user || req.user.id
    });
    
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

exports.getStudentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('itemId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

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