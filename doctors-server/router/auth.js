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

router.get("/", (req, res) => {
  res.send("Hello Wolrd in router/auth/home");
});

router.post("/signup", async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;
  console.log(req.body);
  if (!name || !email || !phone || !password || !cpassword) {
    console.log(name);
    console.log(email);
    console.log(phone);
    console.log(password);
    console.log(cpassword);
    return res.json({ message: "plz filled the filed properly" });
  }
  try {
    const userExit = await User.findOne({ email: email });
    if (userExit) {
      return res.status(422).json({ message: "Email already exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ message: "password not mached" });
    } else {
      const user = new User({ name, email, phone, password, cpassword });
      await user.save();
      res.status(201).json({ message: "registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "plz fill the data" });
    }

    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      const token = generateToken(userLogin._id);
      // console.log(token);
      //cookie

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credential" });
      } else {
        res.json({ message: "user login successfull", userLogin, token });
      }
    } else {
      res.status(400).json({ error: "Invalid Credential" });
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/doctorsignup", async (req, res) => {
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
});

router.post("/doctorlogin", async (req, res) => {
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
});

router.get("/fetchcitydoctors", async (req, res) => {
  const { city } = req.query; // Ensure you're reading from query, not body
  console.log("Fetching doctors for city:", city);
  try {
    const doctors = await Doctor.find({ city }).select(
      "-tokens -password -cpassword"
    );
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

router.get("/fetchdoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-tokens -password -cpassword");
    // const doctorIds = doctors.map(doctor => doctor._id);
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

router.get("/getdoctorwithid/:doctorId", async (req, res) => {
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
});

router.post("/addSlot/:doctorId", async (req, res) => {
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
});

router.delete("/deleteSlot/:doctorId/:slotId", async (req, res) => {
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
});

// Book Slot
router.post("/doctors/:doctorId/slots/:slotId/book", async (req, res) => {
  const { doctorId, slotId } = req.params;
  const { patientId } = req.body;

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

    slot.isBooked = true;
    slot.patientId = patientId;

    await doctor.save();

    const updatedDoctor = await Doctor.findById(doctorId).populate(
      "slots.patientId"
    );
    const bookedSlot = updatedDoctor.slots.id(slotId);

    res
      .status(200)
      .json({ message: "Slot booked successfully", slot: bookedSlot });
  } catch (error) {
    console.error(`Error booking slot: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/patients/:patientId/bookedSlots", async (req, res) => {
  console.log(req.body);
  const { patientId } = req.params;

  try {
    const bookedSlots = await Doctor.aggregate([
      { $unwind: "$slots" },
      {
        $match: {
          "slots.patientId": new mongoose.Types.ObjectId(patientId),
          "slots.date": { $gte: new Date() },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "slots.patientId",
          foreignField: "_id",
          as: "patientInfo",
        },
      },
      { $unwind: "$patientInfo" },
      {
        $project: {
          _id: "$slots._id",
          date: "$slots.date",
          startTime: "$slots.startTime",
          endTime: "$slots.endTime",
          isBooked: "$slots.isBooked",
          patientInfo: "$patientInfo",
        },
      },
    ]);

    res.json(bookedSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/doctors/:doctorId/patients", async (req, res) => {
  const { doctorId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId).populate("slots.patientId");

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
      }));

    res.status(200).json(bookedSlots);
  } catch (error) {
    console.error(`Error fetching patients: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/doctors/:doctorId/feedback", async (req, res) => {
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
});

// Get feedbacks for a specific doctor
router.get("/doctors/:doctorId/feedbacks", async (req, res) => {
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
});

router.get("/logout", (req, res) => {
  console.log("logout page");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});
module.exports = router;
