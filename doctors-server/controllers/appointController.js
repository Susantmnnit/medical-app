const Appointment = require("../model/bookingschema");

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
