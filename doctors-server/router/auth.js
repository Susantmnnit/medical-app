const express = require("express");
const router = express.Router();

require("../database/db");
const Doctor = require("../model/doctorschema");

const { Feedback } = require("../model/feedbackscema");
const { register, login, update } = require("../controllers/userController");
const {
  doctorSignup,
  doctorLogin,
  fetchDoctors,
  getDoctorWithId,
  addSlot,
  deleteSlot,
  doctorsPatient,
  doctorsFeedback,
  updateDoctor,
} = require("../controllers/doctorController");
const {
  bookSlot,
  conference,
  bookedSlots,
} = require("../controllers/appointController");
const auth = require("../middleware/authentication");

router.get("/", (req, res) => {
  res.send("Hello Wolrd in router/auth/home");
});

router.post("/signup", register);

router.post("/login", login);

router.post("/doctorsignup", doctorSignup);

router.post("/doctorlogin", doctorLogin);

router.get("/fetchdoctors", fetchDoctors);

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

router.get("/getdoctorwithid/:doctorId", getDoctorWithId);

router.post("/addSlot", auth, addSlot);

router.delete("/deleteSlot/:slotId", auth, deleteSlot);

router.post("/doctors/:doctorId/slots/:slotId/book", auth, bookSlot);

router.get("/:slotId", conference);

router.get("/patients/bookedSlots", auth, bookedSlots);

router.get("/doctors/patients", auth, doctorsPatient);

router.post("/doctors/:doctorId/feedback", doctorsFeedback);

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

router.put("/patient", auth, update);

router.put("/doctor", auth, updateDoctor);

router.post("/logout", (req, res) => {
  res.send({
    status: 200,
    data: {
      message: "successful",
      token: undefined,
    },
  });
});
module.exports = router;
