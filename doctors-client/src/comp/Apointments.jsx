import React from 'react';
import { Box, Icon, Typography } from '@mui/material';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';

const appointments = [
  { id: 1, time: '5:00 PM', date: '12 May', doctor: 'Dr. Soshi Samanta', status: 'Scheduled' },
  { id: 2, time: '6:00 PM', date: '13 May', doctor: 'Dr. John Doe', status: 'Completed' },
  { id: 2, time: '6:00 PM', date: '13 May', doctor: 'Dr. John Doe', status: 'Completed' },
    { id: 2, time: '6:00 PM', date: '13 May', doctor: 'Dr. John Doe', status: 'Completed' },
    { id: 2, time: '6:00 PM', date: '13 May', doctor: 'Dr. John Doe', status: 'Completed' },
    { id: 2, time: '6:00 PM', date: '13 May', doctor: 'Dr. John Doe', status: 'Completed' },
    { id: 2, time: '6:00 PM', date: '13 May', doctor: 'Dr. John Doe', status: 'Completed' },
    { id: 2, time: '6:00 PM', date: '13 May', doctor: 'Dr. John Doe', status: 'Completed' },
  { id: 2, time: '6:00 PM', date: '13 May', doctor: 'Dr. John Doe', status: 'Completed' },
];

export default function Appointments() {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'antiquewhite',
          py: 2,
          fontWeight: '500',
          color: '#7d8285',
        }}
      >
        Appointments
      </Typography>
      <Box
        sx={{
          flex: 1,
          overflowY: 'scroll',
          padding: '5px',
        }}
      >
        <ul className='appointments_list' style={{ listStyleType: 'none', padding: 0,overflowY:'scroll' }}>
          {appointments.map(appointment => (
            <li className='appointment' key={appointment.id}>
              <Typography variant="body1" sx={{ mb: 0, display: 'flex', color: '#8c6b52' }}>
                <Icon sx={{ color: '#dfc39c', mr: 1 }}>
                  <KeyboardDoubleArrowRightOutlinedIcon />
                </Icon>
                Appointment with {appointment.doctor} at {appointment.time} on {appointment.date}
              </Typography>
              <Typography variant="body2" sx={{ color: appointment.status === 'Scheduled' ? 'red' : 'green', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                {appointment.status}
              </Typography>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}
