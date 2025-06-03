const express = require('express');
const {
  createPayment,
  getStudentPayments,
  updatePaymentStatus,
  getAllPayments
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getStudentPayments)
  .post(protect, authorize('admin'), createPayment);

router.route('/all')
  .get(protect, authorize('admin'), getAllPayments);

router.route('/:id')
  .put(protect, authorize('admin'), updatePaymentStatus);

module.exports = router;