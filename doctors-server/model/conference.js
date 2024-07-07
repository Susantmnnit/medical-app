const mongoose = require("mongoose");

const ConferenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slotId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Conference", ConferenceSchema);
