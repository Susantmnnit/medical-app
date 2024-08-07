const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slotSchema = require("./slotSchema");
// const dotenv=require("dotenv");

// dotenv.config({path:'../config.env'});
const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
      require: true,
    },
    specalist: {
      type: String,
      require: true,
    },
    hospital_affiliations: [String],
    clinic_name: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    pin: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    cpassword: {
      type: String,
      require: true,
    },
    slots: [slotSchema],
  },
  { timestamps: true }
);

doctorSchema.pre("save", async function (next) {
  console.log("hi from inside");
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});
doctorSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    // this.tokens = this.tokens.concat({ token: token });
    // await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};
const Doctor = mongoose.model("DOCTOR", doctorSchema);

module.exports = Doctor;
