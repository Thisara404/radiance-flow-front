const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  getUserEvents,
  getPublicEvents,
  registerForEvent,
  getEventRegistrations,
  getMyEventRegistrations
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/public', getPublicEvents);
router.get('/:id', getEvent);

// Protected routes
router.post('/:id/register', protect, registerForEvent);
router.get('/registrations/me', protect, getMyEventRegistrations);
router.get('/user', protect, getUserEvents);

// Admin routes
router.get('/:id/registrations', protect, authorize('admin'), getEventRegistrations);
router.route('/')
  .get(protect, authorize('admin'), getEvents)
  .post(protect, createEvent);

router.route('/:id')
  .put(protect, updateEvent)
  .delete(protect, authorize('admin'), deleteEvent);

router.put('/:id/status', protect, authorize('admin'), updateEventStatus);

module.exports = router;