import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { motion } from "framer-motion";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MedicationLiquidOutlinedIcon from '@mui/icons-material/MedicationLiquidOutlined';

export default function Navheader() {
  return (
    <AppBar component="nav">
        <Toolbar>
        <MedicationLiquidOutlinedIcon style={{width:"34px"}}/>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: {sm: 'block' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ display: {sm: 'block' } }}>
            <motion.div className='button-to-go' whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} whileTap={{ scale: 0.9 }}>
              <Button sx={{ color: '#fff' }}>
                login
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>
  )
}
