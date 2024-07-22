import { Box, Container, Typography, Grid, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import image from '../images/brotherimg.png';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import Feedbacks from './Feedbacks';
import SlotModal from './Slotmodal';
import Slots from './Slots';
import BookedSlots from './bookedSlots';

export default function DoctorsProfile() {
  const user = localStorage.getItem("Data")
    ? JSON.parse(localStorage.getItem("Data"))
    : null;

  console.log("user", user);
  const { doctor_id } = useParams();
  const [doctor, setDoctors] = useState("");
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();
  console.log("doctor_id", doctor_id);

  useEffect(() => {
    handleDoctorsDetails();
  },[doctor_id]);

  const handleDoctorsDetails = async (req, res) => {
    try {
      const doctor = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getdoctorwithid/${doctor_id}`);
      setDoctors(doctor.data);
      setSlots(doctor.data.slots);
      console.log(doctor);
    } catch (err) {
      console.log(err);
    }
  }

  const [showModal, setShowModal] = useState(false);
  
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const seePatient = () => {
    navigate(`/patients/${doctor_id}`);
  }


  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} sx={{minHeight:'100vh'}}>
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
                  {doctor.name}
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
                      Specialization
                      <Typography component="p" sx={{ fontSize: '17px', color: '#768b9d' }}>
                        {doctor.specalist}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ color: '#6b6f7e', fontSize: '20px' }}>
                      Clinic
                      <Typography component="p" sx={{ fontSize: '17px', color: '#768b9d' }}>
                        {doctor.clinic_name}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ color: '#6b6f7e', fontSize: '20px' }}>
                      Location
                      <Typography component="div" sx={{ fontSize: '20px', color: '#768b9d',display:'flex',overflowX:'scroll' }}>
                        {doctor.address},{doctor.city},{doctor.pin}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ color: '#6b6f7e', fontSize: '20px' }}>
                      Hospitals
                      <Typography component="p" sx={{ fontSize: '17px', color: '#768b9d' }}>
                        Durga Hospitals
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              {user.userLogin ? (
                <Slots slots={ slots } doctorId={doctor_id} />
              ) : (
                  <div className="added-slots">
                    <div className="doctorpatient">
                      <Button
                className='doctor_button'
                    sx={{ backgroundColor: '#f59f43eb', margin: '9px', color: 'white' }}
                    onClick={handleOpenModal}
              >
                Add Slots
                    </Button>
                    <Button
                className='doctor_button'
                    sx={{ backgroundColor: '#f59f43eb', margin: '9px', color: 'white' }}
                    onClick={seePatient}
              >
                See Patients
                    </Button>
                    </div>
                    <Slots slots={slots} doctorId={doctor_id} />
                </div>
              )}
              <SlotModal show={showModal} handleClose={handleCloseModal} doctorId={doctor_id} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems:'center'
            }}
          >
            { user.userLogin &&
              <BookedSlots userId={user.userLogin._id} />
            }
            <Feedbacks doctorId={doctor_id} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
