const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DOCTOR",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = {
  Feedback,
};
