const express = require('express');
const { 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser,
  getUserStats 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers);
router.route('/stats').get(getUserStats); // Add this line
router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;