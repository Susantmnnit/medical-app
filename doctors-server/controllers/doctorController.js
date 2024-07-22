const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
// const jwt=require("bcryptjs");

require("../database/db");
const User = require("../model/userschema");
const Doctor = require("../model/doctorschema");
const Appointment = require("../model/bookingschema");
const Authenticate = require("../middleware/authentication");
const { Feedback } = require("../model/feedbackscema");

const doctorSignup = async (req, res) => {
  const {
    name,
    email,
    phone,
    specalist,
    hospital_affiliations,
    clinic_name,
    address,
    city,
    pin,
    password,
    cpassword,
  } = req.body;
  if (
    !name ||
    !email ||
    !phone ||
    !specalist ||
    !clinic_name ||
    !address ||
    !city ||
    !pin ||
    !password ||
    !cpassword
  ) {
    console.log(name);
    console.log(email);
    console.log(phone);
    console.log(specalist);
    console.log(password);
    console.log(cpassword);
    return res.json({ error: "plz filled the filed properly" });
  }
  try {
    const doctorExit = await Doctor.findOne({ email: email });
    if (doctorExit) {
      return res.status(422).json({ error: "Email already exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password not mached" });
    } else {
      const doctor = new Doctor({
        name,
        email,
        phone,
        specalist,
        hospital_affiliations,
        clinic_name,
        address,
        city,
        pin,
        password,
        cpassword,
      });
      await doctor.save();
      res.status(201).json({ message: "registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
};

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "plz fill the data" });
    }

    const doctorLogin = await Doctor.findOne({ email: email });
    // console.log(userLogin);
    if (doctorLogin) {
      const isMatch = await bcrypt.compare(password, doctorLogin.password);
      const token = await doctorLogin.generateAuthToken();
      console.log(token);
      //cookie
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credential" });
      } else {
        res.json({ message: "user login successfull", doctorLogin });
      }
    } else {
      res.status(400).json({ error: "Invalid Credential" });
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchDoctors = async (req, res) => {
  const { city, problem } = req.query;
  console.log("Fetching doctors for city:", city, "and problem:", problem);
  try {
    let query = {};
    // if (city) {
    //   query.city = city;
    // }
    if (problem) {
      query.specalist = problem;
    }
    const doctors = await Doctor.find(query).select(
      "-tokens -password -cpassword"
    );
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

const getDoctorWithId = async (req, res) => {
  const doct_id = req.params.doctorId;
  try {
    const doctor = await Doctor.findById(doct_id).select(
      "-tokens -password -cpassword"
    );
    // console.log("doctor", doctor);
    res.json(doctor);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
};

const addSlot = async (req, res) => {
  const { doctorId } = req.params;
  const { date, startTime, endTime } = req.body;

  if (!date || !startTime || !endTime) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const newSlot = { date, startTime, endTime };
    doctor.slots.push(newSlot);
    await doctor.save();

    res.status(201).json({ message: "Slot added successfully", slot: newSlot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteSlot = async (req, res) => {
  const { doctorId, slotId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const slotIndex = doctor.slots.findIndex((slot) => slot._id.equals(slotId));
    if (slotIndex === -1) {
      return res.status(404).json({ error: "Slot not found" });
    }

    doctor.slots.splice(slotIndex, 1);
    await doctor.save();

    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const doctorsPatient = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId).populate({
      path: "slots",
      populate: [
        { path: "patientId", model: "USER" },
        { path: "conferenceId", model: "Conference" },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const bookedSlots = doctor.slots
      .filter((slot) => slot.isBooked)
      .map((slot) => ({
        patient: slot.patientId,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        conference: slot.conferenceId
          ? {
              title: slot.conferenceId.title,
              slotId: slot.conferenceId.slotId,
            }
          : null,
      }));

    res.status(200).json(bookedSlots);
  } catch (error) {
    console.error(`Error fetching patients: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

const doctorsFeedback = async (req, res) => {
  const { doctorId } = req.params;
  const { patientId, comment } = req.body;
  console.log(req.body, doctorId);
  if (!patientId || !comment || !doctorId) {
    return res
      .status(400)
      .json({ error: "Patient ID and comment are required" });
  }

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    console.log("hgghh", doctor, patient);
    const feedback = new Feedback({
      doctor: doctor._id,
      patient: patient._id,
      comment,
    });
    await feedback.save();

    res.status(201).json({ message: "Feedback added successfully", feedback });
  } catch (error) {
    console.error(`Error adding feedback: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

const doctorsFeedbacks = async (req, res) => {
  const { doctorId } = req.params;

  if (!doctorId) {
    return res.status(400).json({ error: "Doctor ID is required" });
  }

  try {
    const feedbacks = await Feedback.find({ doctor: doctorId }).populate(
      "patient",
      "name"
    );
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error(`Error fetching feedbacks: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  doctorSignup,
  doctorLogin,
  fetchDoctors,
  getDoctorWithId,
  addSlot,
  deleteSlot,
  doctorsPatient,
  doctorsFeedback,
  doctorsFeedbacks,
};
