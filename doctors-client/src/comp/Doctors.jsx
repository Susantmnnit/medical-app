import React, { useState } from 'react';
import { Button, Container, Select, MenuItem, FormControl, InputLabel, Box, Card, CardHeader, CardContent, Typography, Avatar, Grid, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cities, problems } from '../comp/Data';
import img from '../images/clinic.jpg';

export default function Doctors() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    city: '',
    problem: '',
  });

  const [doctors, setDoctors] = useState([]);

  const handleInputs = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const findDoctor = async (e) => {
    e.preventDefault();
    const { city, problem } = user;
    try {
      const url = new URL("http://localhost:8000/fetchdoctors");
      const params = {};
      if (city) {
        params.city = city;
      }
      if (problem) {
        params.problem = problem;
      }
      url.search = new URLSearchParams(params).toString();

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

  const handleCardClick = (doctor_id) => {
    console.log(`Navigating to doctorsprofile/${doctor_id}`);
    navigate(`/doctorsprofile/${doctor_id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <Typography
        variant="h6"
        component="div"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        SEARCH FOR DOCTORS
      </Typography>
      <form onSubmit={findDoctor} style={{ padding: "10px", width: '100%' }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select value={user.city} onChange={handleInputs} name="city" label="City">
                {cities.map((city, index) => (
                  <MenuItem key={index} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Problems</InputLabel>
              <Select value={user.problem} onChange={handleInputs} name="problem" label="Problem">
                {problems.map((problem, index) => (
                  <MenuItem key={index} value={problem}>{problem}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" marginTop={2}>
              <Button type="submit" variant="contained" style={{ borderRadius: "10px" }}>Find Doctors</Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <hr style={{ color: '#1a4588', backgroundColor: '#1a4588', height: '2px', border: 'none', width: '80%', margin: '20px 0' }} />
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
                  Specializes in {doctor.specialization}.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {doctor.address}, {doctor.pin}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
