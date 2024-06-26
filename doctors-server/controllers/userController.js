const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
// const jwt=require("bcryptjs");

require("../database/db");
const User = require("../model/userschema");
// const Doctor = require("../model/doctorschema");
const Appointment = require("../model/bookingschema");
const Authenticate = require("../middleware/authentication");

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
      const token = await userLogin.generateAuthToken();
      console.log(token);
      //cookie
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credential" });
      } else {
        res.json({ message: "user login successfull", userLogin });
      }
    } else {
      res.status(400).json({ error: "Invalid Credential" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/booking", async (req, res) => {
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
