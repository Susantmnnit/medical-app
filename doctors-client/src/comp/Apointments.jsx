import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, Typography, Grid, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Apointments({ userId }) {
  const token = localStorage.getItem("token");
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // console.log("slots", userId);
    const fetchSlots = async () => {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/patients/bookedSlots`,config
        );
        console.log("slots", response.data);
        setSlots(response.data);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };

    fetchSlots();
  }, [userId]);

  const gotoroom = (confId) => {
    const conf_id = confId;
    navigate(`/joinconference/${conf_id}`);
  }

  const goToSeeAllApointment = () => {
    navigate('/allapointments')
  }

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
        Your Apointments
      </Typography>
      {slots ? (
        <Grid container style={{ height: "90vh", overflowY: "scroll" }}>
          {slots.map((slot) => (
            <Grid item xs={12} key={slot._id} onClick={() => goToSeeAllApointment()} style={{cursor:'pointer'}}>
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
                  {/* <strong>Patient Name:</strong> {slot.patientInfo.name} */}
                  <strong>Doctor Name:</strong> {slot.doctorInfo.name}
                </Typography>
                <div style={{display:'flex',justifyContent:'center'}}>
                <Button className='doctor_button' sx={{ backgroundColor: '#629d62', margin: '9px', color: 'white' }} onClick={() => gotoroom(slot.conference_slot_id)}>Got to room</Button> 
              </div>
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
          no apointments booked
        </Grid>
      )}
    </Box>
  );
}
