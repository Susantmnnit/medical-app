const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    default: null,
  },
  videoConferenceId: {
    type: String,
    default: null,
  },
  videoConferenceLink: {
    type: String,
    default: null,
  },
  videoConferenceStartTime: {
    type: String,
    default: null,
  },
});

module.exports = slotSchema;
