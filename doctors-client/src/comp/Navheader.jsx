import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { motion } from "framer-motion";
import MedicationLiquidOutlinedIcon from '@mui/icons-material/MedicationLiquidOutlined';
import { useNavigate } from 'react-router-dom';

export default function Navheader() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loginMenuEl, setLoginMenuEl] = React.useState(null);
  const user = localStorage.getItem('Data') ? JSON.parse(localStorage.getItem('Data')) : null;
  const navigate = useNavigate();

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

  const goToProfile = () => {
    if (user.userLogin) {
      navigate("/userprofile");
    }
    else {
      const doctor_id = user.doctorLogin._id;
      navigate(`/doctorsprofile/${doctor_id}`);
    }
    handleClose();
  };

  const logout = () => {
    localStorage.removeItem('Data');
    navigate("/");
    handleClose();
    window.location.reload();
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
          LOGO
        </Typography>
        <Box sx={{ display: { sm: 'block' } }}>
          <motion.div className='button-to-go' whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} whileTap={{ scale: 0.9 }}>
            {user ? (user.userLogin ? (
              <>
                <Button sx={{ color: '#fff' }} onClick={handleMenu}>
                  {user.userLogin.name}
                </Button>
                <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={goToProfile}>Profile</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
                <>
                <Button sx={{ color: '#fff' }} onClick={handleMenu}>
                  {user.doctorLogin.name}
                </Button>
                <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={goToProfile}>Profile</MenuItem>
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
          </motion.div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
