import { Box, Container, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import image from '../images/brotherimg.png';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import Feedbacks from './Feedbacks';
import Apointments from './Apointments';
import BookedSlots from './bookedSlots';

export default function Userprofile() {

  const user = localStorage.getItem('Data') ? JSON.parse(localStorage.getItem('Data')) : null;
  const user_data = user.userLogin;
  const [age, setAge] = useState(1);
  const [problem, setProblem] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'age') {
      setAge(value);
    } else if (id === 'problem') {
      setProblem(value);
    }
  };

  const handleSaveChanges = () => {
    
    const updatedUserData = {
      ...user_data,
      age: age,
      problems: problem,
    };

    
    axios.put(`http://localhost:8000/patient/${user_data._id}`, updatedUserData)
      .then(response => {
        console.log('User data updated successfully:', response.data);
       
        localStorage.setItem('Data', JSON.stringify({ userLogin: updatedUserData }));
        handleCloseModal();
      })
      .catch(error => {
        console.error('Error updating user data:', error);
        
      });
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <img
                  src={image}
                  alt="Doctor"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <Typography variant="h5" sx={{ mt: 1 }}>
                  Mr. {user_data.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  width: '100%',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ color: '#6b6f7e', fontSize: '20px' }}>
                      Age
                      <Typography component="p" sx={{ fontSize: '17px', color: '#768b9d' }}>
                        {user_data.age}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ color: '#6b6f7e', fontSize: '20px' }}>
                      Blood group
                      <Typography component="p" sx={{ fontSize: '17px', color: '#768b9d' }}>
                        {user_data.bloodgroup}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ color: '#6b6f7e', fontSize: '20px' }}>
                      problems
                      <Typography component="p" sx={{ fontSize: '17px', color: '#768b9d' }}>
                        {user_data.problems}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ color: '#6b6f7e', fontSize: '20px' }}>
                      Location
                      <Typography component="div" sx={{ fontSize: '17px', color: '#768b9d',display:'flex',overflowX:'scroll' }}>
                        {user_data.address}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ color: '#6b6f7e', fontSize: '20px' }}>
                      Contact info
                      <Typography component="p" sx={{ fontSize: '17px', color: '#768b9d' }}>
                        {user_data.email},{user_data.phone}
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <button onClick={handleOpenModal} className='edit_button'>Edit</button>
              <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <Typography>Edit Profile Details</Typography>
                </DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="age"
                    label="Age"
                    type="number"
                    fullWidth
                    value={age}
                    onChange={handleChange}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="problem"
                    label="Problem"
                    type="text"
                    fullWidth
                    value={problem}
                    onChange={handleChange}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal}>Cancel</Button>
                  <Button onClick={handleSaveChanges} variant="contained" color="primary">Save Changes</Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Apointments userId={user_data._id} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
