const express = require('express');
const { 
  register, 
  login, 
  getMe,
  updateUserDetails,
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-details', protect, updateUserDetails);
router.put('/update-password', protect, updatePassword);
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router;