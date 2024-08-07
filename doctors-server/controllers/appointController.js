const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
// const jwt=require("bcryptjs");

require("../database/db");
const User = require("../model/userschema");
const Doctor = require("../model/doctorschema");
const Appointment = require("../model/bookingschema");
const Authenticate = require("../middleware/authentication");
const generateToken = require("../middleware/token");
const { default: mongoose } = require("mongoose");
const { Feedback } = require("../model/feedbackscema");
const { generateZoomMeeting } = require("../service/zoom");
const { v4: uuidv4 } = require("uuid");
const Conference = require("../model/conference");

const booking = async (req, res) => {
  const { user, doctor, appointmentDate, durationInMinutes, status } = req.body;
  if (!user || !doctor || !appointmentDate || !durationInMinutes || !status) {
    console.log(user);
    console.log(doctor);
    console.log(appointmentDate);
    console.log(durationInMinutes);
    console.log(status);
    return res.json({ error: "Please fill all the fields properly" });
  }
  try {
    const existingAppointmentUser = await Appointment.findOne({ user: user });
    const existingAppointmentDoctor = await Appointment.findOne({
      doctor: doctor,
    });
    if (existingAppointmentUser || existingAppointmentDoctor) {
      return res.status(422).json({
        error: "User's appointment or doctor's appointment already exists",
      });
    } else {
      const appointment = new Appointment({
        user: user,
        doctor: doctor,
        appointmentDate: new Date(appointmentDate),
        durationInMinutes: durationInMinutes,
        status: status,
      });
      await appointment.save();
      res.status(201).json({ message: "Appointment registered successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const bookSlot = async (req, res) => {
  const { doctorId, slotId } = req.params;
  const { patientId } = req.body;
  const title = "Welcome to Conference";
  if (!patientId) {
    return res.status(400).json({ error: "Patient ID is required" });
  }

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.error(`Doctor not found: ${doctorId}`);
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if the patient has already booked a slot with this doctor
    const alreadyBooked = doctor.slots.some(
      (slot) => slot.patientId && slot.patientId.equals(patientId)
    );
    if (alreadyBooked) {
      console.error(
        `Patient ${patientId} has already booked a slot with doctor ${doctorId}`
      );
      return res
        .status(409)
        .json({ error: "Patient has already booked a slot with this doctor" });
    }

    const slot = doctor.slots.id(slotId);
    if (!slot) {
      console.error(`Slot not found: ${slotId}`);
      return res.status(404).json({ error: "Slot not found" });
    }

    if (slot.isBooked) {
      console.error(`Slot ${slotId} is already booked`);
      return res.status(400).json({ error: "Slot already booked" });
    }

    // Generate a unique conference ID
    const conferenceId = uuidv4();

    // Create a new conference
    const newConference = new Conference({ title, slotId: conferenceId });
    await newConference.save();

    // Update the slot with the booking details and conference ID
    slot.isBooked = true;
    slot.patientId = patientId;
    slot.conferenceId = newConference._id;

    await doctor.save();

    const updatedDoctor = await Doctor.findById(doctorId).populate(
      "slots.patientId"
    );
    const bookedSlot = updatedDoctor.slots.id(slotId);

    res.status(200).json({
      message: "Slot booked successfully",
      slot: bookedSlot,
      conference: newConference,
    });
  } catch (error) {
    console.error(`Error booking slot: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

const bookedSlots = async (req, res) => {
  const { patientId } = req.params;

  try {
    const bookedSlots = await Doctor.aggregate([
      { $unwind: "$slots" },
      {
        $match: {
          "slots.patientId": new mongoose.Types.ObjectId(patientId),
          "slots.isBooked": true,
        },
      },
      {
        $lookup: {
          from: "users", // Assuming your user collection is named "users"
          localField: "slots.patientId",
          foreignField: "_id",
          as: "patientInfo",
        },
      },
      { $unwind: "$patientInfo" },
      {
        $lookup: {
          from: "conferences", // Assuming your conference collection is named "conferences"
          localField: "slots.conferenceId",
          foreignField: "_id",
          as: "conferenceInfo",
        },
      },
      {
        $unwind: { path: "$conferenceInfo", preserveNullAndEmptyArrays: true },
      }, // Preserve slots without conference
      {
        $lookup: {
          from: "doctors", // Assuming your doctor collection is named "doctors"
          localField: "_id",
          foreignField: "_id",
          as: "doctorInfo",
        },
      },
      { $unwind: "$doctorInfo" },
      {
        $project: {
          _id: "$slots._id",
          date: "$slots.date",
          startTime: "$slots.startTime",
          endTime: "$slots.endTime",
          isBooked: "$slots.isBooked",
          patientInfo: "$patientInfo",
          conferenceId: "$slots.conferenceId", // Include conferenceId
          conferenceTitle: "$conferenceInfo.title", // Optionally include conference title if needed
          conference_slot_id: "$conferenceInfo.slotId",
          doctorInfo: "$doctorInfo", // Include doctor info
        },
      },
    ]);

    res.json(bookedSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const conference = async (req, res) => {
  try {
    const conference = await Conference.findOne({ slotId: req.params.slotId });
    if (!conference) {
      return res.status(404).json({ msg: "Conference not found" });
    }
    res.json(conference);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports = { booking, bookSlot, bookedSlots, conference };
