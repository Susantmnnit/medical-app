const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("../database/db");
const User = require("../model/userschema");
const Doctor = require("../model/doctorschema");
const Appointment = require("../model/bookingschema");
const Authenticate = require("../middleware/authentication");

const register = async (req, res) => {
  const {
    name,
    email,
    phone,
    age,
    bloodgroup,
    address,
    problems,
    password,
    cpassword,
  } = req.body;
  console.log(req.body);
  if (
    !name ||
    !email ||
    !phone ||
    !age ||
    !bloodgroup ||
    !address ||
    !problems ||
    !password ||
    !cpassword
  ) {
    // console.log(name);
    // console.log(email);
    // console.log(phone);
    // console.log(password);
    // console.log(cpassword);
    return res.json({ message: "plz filled the filed properly" });
  }
  try {
    const userExit = await User.findOne({ email: email });
    if (userExit) {
      return res.status(422).json({ message: "Email already exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ message: "password not mached" });
    } else {
      const user = new User({
        name,
        email,
        phone,
        age,
        bloodgroup,
        address,
        problems,
        password,
        cpassword,
      });
      await user.save();
      res.status(201).json({ message: "registered successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "plz fill the data" });
    }

    const user = await User.findOne({ email: email });
    // console.log(userLogin);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });

      // console.log(token);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credential" });
      } else {
        const userLogin = {
          _id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          age: user.age,
          bloodgroup: user.bloodgroup,
          problems: user.problems,
          phone: user.phone,
        };
        res.send({
          status: 200,
          data: {
            message: "student successfully logged in",
            token: token,
            userLogin: userLogin,
          },
        });
      }
    } else {
      res.status(400).json({ error: "Invalid Credential" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const update = async (req, res) => {
  const id = req._id;
  const { age, problems } = req.body;
  // console.log(id);
  try {
    const updatedData = await User.findByIdAndUpdate(
      id,
      { age, problems },
      { new: true }
    );

    // console.log(updatedData);
    if (!updatedData) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = {
      _id: updatedData._id,
      name: updatedData.name,
      email: updatedData.email,
      address: updatedData.address,
      age: updatedData.age,
      bloodgroup: updatedData.bloodgroup,
      problems: updatedData.problems,
      phone: updatedData.phone,
    };
    res.status(200).json(updatedUser);
  } catch (error) {
    // console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, update };
