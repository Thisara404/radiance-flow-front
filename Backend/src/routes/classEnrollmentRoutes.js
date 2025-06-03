const express = require('express');
const { getClassEnrollments } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getClassEnrollments);

module.exports = router;