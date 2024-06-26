import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";

const BookedSlots = ({ userId }) => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    console.log("slots", userId);
    const fetchSlots = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/patients/${userId}/bookedSlots`
        );
        console.log("slots", response.data);
        setSlots(response.data);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };

    fetchSlots();
  }, [userId]);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#d0f2cb",
          borderStartStartRadius: "10px",
          borderStartEndRadius: "10px",
          color: "#7e766d",
        }}
      >
        Your Booked Slots
      </Typography>
      {slots ? (
        <Grid container style={{ height: "20vh", overflowY: "scroll" }}>
          {slots.map((slot) => (
            <Grid item xs={12} key={slot._id}>
              <Paper elevation={2} sx={{ padding: "10px" }}>
                <Typography variant="body1">
                  <strong>Date:</strong>{" "}
                  {new Date(slot.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Time:</strong> {slot.startTime} - {slot.endTime}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong>{" "}
                  {slot.isBooked ? "Booked" : "Available"}
                </Typography>
                <Typography variant="body1">
                  <strong>Patient Name:</strong> {slot.patientInfo.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#bdbca5",
          }}
        >
          no slots booked
        </Grid>
      )}
    </Box>
  );
};

export default BookedSlots;
