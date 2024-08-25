import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { motion } from "framer-motion";
import MedicationLiquidOutlinedIcon from '@mui/icons-material/MedicationLiquidOutlined';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutStudent } from '../redux/Patientslice';
import { logoutDoctor } from '../redux/Doctorslice';

export default function Navheader() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loginMenuEl, setLoginMenuEl] = React.useState(null);

  const isAuthenticatedPatients = useSelector(state => state.patients.token !== null);
  const isAuthenticatedDoctors = useSelector(state => state.doctors.token !== null);
  const isAuthenticated = isAuthenticatedPatients || isAuthenticatedDoctors;

  const Patient = useSelector(state => state.patients);
  const Doctor = useSelector(state => state.doctors);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginMenu = (event) => {
    setLoginMenuEl(event.currentTarget);
  };

  const handleLoginClose = () => {
    setLoginMenuEl(null);
  };

  const handlePatientLogin = () => {
    navigate("/patientlogin");
    handleLoginClose();
  };

  const handleDoctorLogin = () => {
    navigate("/doctorlogin");
    handleLoginClose();
  };
  const handleDoctors = () => {
    navigate("/");
   }
  const handleHelp = (e) => {
    navigate('/helpcentre');
  }

  const goToProfile = () => {
    if (isAuthenticatedPatients) {
      navigate("/userprofile");
    }
    else {
      const doctor_id = Doctor._id;
      navigate(`/doctorsprofile/${doctor_id}`);
    }
    handleClose();
  };

  const seeSlots = () => {
    navigate('/slotmodule')
  }

  const seePatient = () => {
    navigate(`/patients/${Doctor._id}`);
  }

  const goToApointment = () => {
    navigate('/apoint')
  }

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(logoutStudent());
    dispatch(logoutDoctor());
    navigate("/");
    handleClose();
    // window.location.reload();
  };

  return (
    <AppBar component="nav" style={{ backgroundColor: '#9caab7' }}>
      <Toolbar>
        <MedicationLiquidOutlinedIcon style={{ width: "34px" }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { sm: 'block' } }}
        >
          MedConsult
        </Typography>
        <Box sx={{ display: { sm: 'block' } }}>
          <div className='button-to-go' whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} whileTap={{ scale: 0.9 }}>
            <Button sx={{ color: '#fff' }} onClick={handleHelp}>
              contact
            </Button>
            {isAuthenticated ? (isAuthenticatedPatients ? (
              <>
                <Button sx={{ color: '#fff' }} onClick={handleDoctors}>
                  find doctors
                </Button>
                <Button sx={{ color: '#fff' }} onClick={handleMenu}>
                  {Patient.name}
                </Button>
                <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={goToProfile}>Profile</MenuItem>
                  <MenuItem onClick={goToApointment}>Apointments</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
                <>
                <Button sx={{ color: '#fff' }} onClick={handleMenu}>
                  {Doctor.name}
                </Button>
                <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem onClick={goToProfile}>Profile</MenuItem>
                    <MenuItem onClick={seeSlots}>See Slots</MenuItem>
                    <MenuItem onClick={seePatient}>Patients</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            )) : (
                <>
                <Button sx={{ color: '#fff' }} onClick={handleLoginMenu}>
                  Login
                </Button>
                <Menu id="menu-login" anchorEl={loginMenuEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(loginMenuEl)} onClose={handleLoginClose}>
                  <MenuItem onClick={handlePatientLogin}>Patient Login</MenuItem>
                  <MenuItem onClick={handleDoctorLogin}>Doctor Login</MenuItem>
                </Menu>
              </>
            )}
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
