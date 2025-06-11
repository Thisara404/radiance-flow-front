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

// Protected routes
router.post('/:id/register', protect, registerForEvent);
router.get('/registrations/me', protect, getMyEventRegistrations);
router.get('/user', protect, getUserEvents);

// Admin and organizer routes
router.route('/')
  .get(protect, authorize('admin'), getEvents)
  .post(protect, authorize('admin', 'organizer'), createEvent);

// Event-specific routes - these must come before the generic /:id route
router.get('/:id/registrations', protect, authorize('admin'), getEventRegistrations);
router.put('/:id/status', protect, authorize('admin'), updateEventStatus);

// Generic routes - these must come LAST
router.route('/:id')
  .get(getEvent)
  .put(protect, authorize('admin', 'organizer'), updateEvent)
  .delete(protect, authorize('admin', 'organizer'), deleteEvent);

module.exports = router;