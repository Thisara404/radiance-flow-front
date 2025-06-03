const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: [true, "Please add an event type"],
  },
  title: String,
  date: {
    type: Date,
    required: [true, "Please add a date"],
  },
  time: {
    type: String,
    required: [true, "Please add a time"],
  },
  duration: String,
  venue: {
    type: String,
    required: [true, "Please add a venue"],
  },
  contactPerson: {
    type: String,
    required: [true, "Please add a contact person"],
  },
  contactEmail: {
    type: String,
    required: [true, "Please add a contact email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  contactPhone: String,
  description: String,
  expectedGuests: Number,
  price: String,
  category: {
    type: String,
    enum: [
      "Welcome dance",
      "Wedding",
      "Dance choreography",
      "Functions",
      "Music videos",
      "Commercials backup dance",
    ],
    default: "Other",
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Cancelled"],
    default: "Pending",
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", EventSchema);
