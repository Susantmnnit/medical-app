import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import Navheader from './Navheader';
import Homeview from './Homeview';
import Login from './Login';
import Doctors from './Doctors';

function Home(props) {
  const { window } = props;
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="sm">
          <Homeview/>
        </Container>
      </Box>
    </Box>
  );
}

Home.propTypes = {
  window: PropTypes.func,
};

export default Home;
