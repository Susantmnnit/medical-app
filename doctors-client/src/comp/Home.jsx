import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { Container } from '@mui/material';
import Navheader from './Navheader';
import Homeview from './Homeview';
import Login from './Login';

function DrawerAppBar(props) {
  const { window } = props;
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <CssBaseline />
        <Navheader/>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Container maxWidth="sm" className='content'>
          {/* <Homeview/> */}
          <Login/>
        </Container>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
