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
    console.log("doctor", doctor);
    res.json(doctor);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
});

router.post("/addSlot/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const { date, startTime, endTime } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }

    doctor.slots.push({ date, startTime, endTime });
    await doctor.save();
    res.status(201).send(doctor);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/doctors/:doctorId/slots/:slotId/book", async (req, res) => {
  console.log(",,,,,,,", req.body);
  try {
    const { doctorId, slotId } = req.params;
    const { patientId } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const slot = doctor.slots.id(slotId);
    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    if (slot.isBooked) {
      return res.status(400).json({ error: "Slot already booked" });
    }

    slot.isBooked = true;
    slot.patientId = patientId;

    await doctor.save();

    res.status(200).json({ message: "Slot booked successfully", slot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/about", Authenticate, (req, res) => {
  console.log("About");
  res.send(req.rootUser);
});

router.get("/logout", (req, res) => {
  console.log("logout page");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});
module.exports = router;
