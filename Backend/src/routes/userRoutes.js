const express = require('express');
const { getUsers, getUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Add authorization middleware
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers);
router.route('/:id').get(getUser);

module.exports = router;