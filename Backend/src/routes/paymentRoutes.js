const express = require('express');
const {
  createPaymentOrder,
  capturePayment,
  getPaymentSlip,
  refundPayment,
  getMyPaymentHistory,
  getAllPayments,
  getPaymentStats,
  handlePayPalReturn,
  handlePayPalCancel,
  cancelMyPayment, // Add this import
  // Legacy methods
  createPayment,
  getStudentPayments,
  updatePaymentStatus
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { getUserStats } = require('../controllers/userController'); // Import getUserStats

const router = express.Router();

// Public PayPal routes (no auth needed for return/cancel)
router.get('/paypal/return', handlePayPalReturn);
router.get('/paypal/cancel', handlePayPalCancel);

// Protect all other routes
router.use(protect);

// User routes
router.post('/create-order', createPaymentOrder);
router.post('/capture/:orderId', capturePayment);
router.get('/my-history', getMyPaymentHistory);
router.get('/:id/slip', getPaymentSlip);
router.post('/:id/cancel', cancelMyPayment); // Add this route for students

// Legacy user routes
router.get('/', getStudentPayments);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllPayments);
router.get('/admin/stats', authorize('admin'), getPaymentStats);
router.post('/admin/create', authorize('admin'), createPayment);
router.post('/:id/refund', authorize('admin'), refundPayment);
router.put('/:id/status', authorize('admin'), updatePaymentStatus);
router.get('/admin/user-stats', authorize('admin'), getUserStats); // Add route for user stats

// Legacy admin routes
router.get('/all', authorize('admin'), getAllPayments);
router.put('/:id', authorize('admin'), updatePaymentStatus);

module.exports = router;