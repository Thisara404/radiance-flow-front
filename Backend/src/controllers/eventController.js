const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');

// @desc    Get all events
// @route   GET /api/events
// @access  Private/Admin
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    console.log('Creating event with data:', req.body);
    
    // Validate required fields
    const requiredFields = ['eventType', 'date', 'time', 'venue'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Set default values for optional fields
    const eventData = {
      ...req.body,
      organizer: req.user.id,
      contactPerson: req.body.contactPerson || req.user.name,
      contactEmail: req.body.contactEmail || req.user.email,
      title: req.body.title || req.body.eventType,
      category: req.body.category || 'Dance choreography',
      status: req.body.status || 'Approved', // Auto-approve admin events
      expectedGuests: parseInt(req.body.expectedGuests) || 0,
      price: req.body.price || '0'
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    console.log('Updating event with ID:', req.params.id);
    console.log('Update data:', req.body);
    
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    // Make sure user is event organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this event`
      });
    }

    // Update the event
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    console.log('Event updated successfully:', event._id);

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    // Check if user is authorized to delete this event
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this event`
      });
    }

    // Delete related event registrations first
    await EventRegistration.deleteMany({ event: req.params.id });

    // Use deleteOne() instead of remove()
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update event status
// @route   PUT /api/events/:id/status
// @access  Private/Admin
exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status'
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error updating event status:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get events for specific user
// @route   GET /api/events/user
// @access  Private
exports.getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get public events (only approved events)
// @route   GET /api/events/public
// @access  Public
exports.getPublicEvents = async (req, res) => {
  try {
    // Only return approved events for public consumption
    const events = await Event.find({ status: 'Approved' })
      .sort({ date: 1 }) // Sort by date ascending
      .limit(20); // Limit to 20 events
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching public events:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if the event is approved
    if (event.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for an event that is not approved'
      });
    }
    
    // Check if the event has already passed
    const eventDate = new Date(event.date);
    if (eventDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for a past event'
      });
    }
    
    // Check if user is already registered for this event
    const existingRegistration = await EventRegistration.findOne({
      event: event._id,
      user: req.user.id
    });
    
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }
    
    // Create event registration
    const registration = await EventRegistration.create({
      event: event._id,
      user: req.user.id,
      status: 'confirmed'
    });
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: registration
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get registrations for a specific event
// @route   GET /api/events/:id/registrations
// @access  Private/Admin
exports.getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const registrations = await EventRegistration.find({ event: event._id })
      .populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Error getting event registrations:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get events registered by the current user
// @route   GET /api/events/registrations/me
// @access  Private
exports.getMyEventRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ user: req.user.id })
      .populate({
        path: 'event',
        select: 'title eventType date time venue description price category'
      });
    
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Error getting user event registrations:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};