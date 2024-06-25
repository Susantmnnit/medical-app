import React, { useState } from 'react';
import { Button, Container, Select, MenuItem, FormControl, InputLabel, Box, Card, CardHeader, CardContent, Typography, Avatar, IconButton, Grid, CardMedia } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';  // Make sure to install react-router-dom
import img from '../images/clinic.jpg'

export default function Doctors() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    city: '',
    problem: '',
  });

  const [doctors, setDoctors] = useState([]);

  const cities = ['c2', 'c1', 'City C','Aurangabad'];
  const problems = ['Problem 1', 'Problem 2', 'Problem 3',];

  const handleInputs = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };


  const findDoctor = async (e) => {
    e.preventDefault();
    const { city } = user;
    try {
      const url = new URL("http://localhost:8000/fetchcitydoctors");
      url.search = new URLSearchParams({ city }).toString();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  console.log("doctors--", doctors);

  const handleCardClick = (doctor_id) => {
    console.log(`Navigating to doctorsprofile/${doctor_id}`);
    navigate(`/doctorsprofile/${doctor_id}`);
  };


  return (
    <Container maxWidth="xl" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',alignItems:'center',padding:'20px' }}>
      <Typography
        variant="h6"
        component="div"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        SEARCH FOR DOCTORS
      </Typography>
      <form method='POST' onSubmit={findDoctor} style={{ padding: "10px", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Box display="flex" gap={2} justifyContent="center" sx={{ width: '100vh' }}>
          <FormControl fullWidth>
            <InputLabel>City</InputLabel>
            <Select value={user.city} onChange={handleInputs} name="city" label="City">
              {cities.map((city, index) => (
                <MenuItem key={index} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Problems</InputLabel>
            <Select value={user.problem} onChange={handleInputs} name="problem" label="Problem">
              {problems.map((problem, index) => (
                <MenuItem key={index} value={problem}>{problem}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" justifyContent="center" marginTop={2}>
          <Button type="submit" variant="contained" style={{ borderRadius: "10px" }}>Find Doctors</Button>
        </Box>
      </form>
      <hr style={{ color: '#1a4588', backgroundColor: '#1a4588', height: '2px', border: 'none', width: '61%', margin: '20px 0' }} />
      <Grid container spacing={3} sx={{ width: '80%' }}>
        {doctors.map(doctor => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={doctor._id}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                transition: 'transform 0.2s', 
                '&:hover': { 
                  transform: 'scale(1.05)' 
                },
                boxShadow: 3,
                borderRadius: 2
              }} 
              onClick={() => handleCardClick(doctor._id)}
            >
              <CardMedia
                component="img"
                height="140"
                image={img}
                alt={doctor.name}
              />
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "primary.main" }} aria-label="recipe">
                    {doctor.name[0]}
                  </Avatar>
                }
                title={doctor.name}
                subheader={<Typography>Clinic: {doctor.clinic_name}</Typography>}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Specializes in {doctor.specalist}.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {doctor.address},{doctor.pin}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
