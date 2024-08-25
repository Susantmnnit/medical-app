import { Box, Container, Typography, Grid, Button, DialogActions, TextField, DialogContent, DialogTitle, Dialog } from '@mui/material';
import React, { useEffect, useState } from 'react';
import image from '../images/brotherimg.png';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import Feedbacks from './Feedbacks';
import SlotModal from './Slotmodal';
import Slots from './Slots';
import BookedSlots from './bookedSlots';
import { useDispatch, useSelector } from 'react-redux';
import { redirect_to_dashboard_doctors } from '../redux/Doctorslice';

export default function DoctorsProfile() {
  const isAuthenticatedPatients = useSelector(
    (state) => state.patients.token !== null
  );
  const user = useSelector((state) => state.patients);
  const doctors = useSelector((state) => state.doctors);
  // console.log("user", user);
  const token = localStorage.getItem("token");
  const { doctor_id } = useParams();
  const [doctor, setDoctors] = useState("");
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();
  // console.log("doctor_id", doctor_id);

  useEffect(() => {
    handleDoctorsDetails();
  },[doctor_id]);

  const handleDoctorsDetails = async (req, res) => {
    try {
      const doctor = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getdoctorwithid/${doctor_id}`);
      setDoctors(doctor.data);
      setSlots(doctor.data.slots);
      // console.log(doctor);
    } catch (err) {
      console.log(err);
    }
  }
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const [clinic_name, setClinic] = useState("");
  const [pin, setPin] = useState("");
  const [address, setAddress] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'pin') {
      setPin(value);
    } else if (id === 'clinic_name') {
      setClinic(value);
    }else if (id === 'city') {
      setCity(value);
    }else if (id === 'address') {
      setAddress(value);
    }
  };

  const handleSaveChanges = () => {
    
    const updatedUserData = {
      ...doctors,
      pin: pin,
      clinic_name: clinic_name,
      city: city,
      address: address
    };
    // console.log(token);
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/doctor`, updatedUserData,config)
      .then(response => {
        // console.log('User data updated successfully:', response.data);
        alert('User data updated successfully refresh to see changes')
        const doctorLogin = response.data;
        dispatch(redirect_to_dashboard_doctors({
          _id: doctorLogin._id,
          name: doctorLogin.name,
          email: doctorLogin.email,
          address: doctorLogin.address,
          city: doctorLogin.city,
          pin: doctorLogin.pin,
          clinic_name: doctorLogin.clinic_name,
          specalist: doctorLogin.specalist,
          phone: doctorLogin.phone,
        }));
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
              {isAuthenticatedPatients ? (
                <Slots slots={ slots } doctorId={doctor_id} />
              ) : (
                  <button onClick={handleOpenModal} className='edit_button'>Edit</button>
                  // <div className="added-slots"></div>
              )}
            </Box>
              <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <Typography>Edit Profile Details</Typography>
                </DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="clinic_name"
                    label="Clinic"
                    type="text"
                    fullWidth
                    value={clinic_name}
                    onChange={handleChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="address"
                    label="Address"
                    type="text"
                    fullWidth
                    value={address}
                    onChange={handleChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="city"
                    label="City"
                    type="text"
                    fullWidth
                    value={city}
                    onChange={handleChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="pin"
                    label="Pin"
                    type="text"
                    fullWidth
                    value={pin}
                    onChange={handleChange}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal}>Cancel</Button>
                  <Button onClick={handleSaveChanges} variant="contained" color="primary">Save Changes</Button>
                </DialogActions>
              </Dialog>
          </Grid>
          <Grid item xs={12} md={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems:'center'
            }}
          >
            {/* { isAuthenticatedPatients &&
              <BookedSlots userId={user._id} />
            } */}
            <Feedbacks doctorId={doctor_id} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
