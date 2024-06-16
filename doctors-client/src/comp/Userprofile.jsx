import { Box, Container, Typography, Grid, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import image from '../images/brotherimg.png';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import Feedbacks from './Feedbacks';
import Apoinments from './Apointments';

export default function Userprofile() {

  const user = localStorage.getItem('Data') ? JSON.parse(localStorage.getItem('Data')) : null;
  const user_data = user.userLogin;
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
                        50
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ color: '#6b6f7e', fontSize: '20px' }}>
                      Blood group
                      <Typography component="p" sx={{ fontSize: '17px', color: '#768b9d' }}>
                        A+
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ color: '#6b6f7e', fontSize: '20px' }}>
                      problems
                      <Typography component="p" sx={{ fontSize: '17px', color: '#768b9d' }}>
                        headech
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ color: '#6b6f7e', fontSize: '20px' }}>
                      Location
                      <Typography component="p" sx={{ fontSize: '17px', color: '#768b9d' }}>
                        Address
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
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Apoinments/>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
