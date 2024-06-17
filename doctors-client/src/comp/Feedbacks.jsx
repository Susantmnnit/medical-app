import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Button, Icon, Typography, Input, Divider } from '@mui/material';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';

export default function Feedbacks({doctorId}) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const user = localStorage.getItem("Data") ? JSON.parse(localStorage.getItem("Data")) : null;
  const patientId = user && user.userLogin ? user.userLogin._id : null;

  useEffect(() => {
    // console.log(doctorId);
    const fetchFeedbacks = async () => {
      if (!doctorId) {
        console.error('Doctor ID is missing in the URL.');
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:8000/doctors/${doctorId}/feedbacks`);
        setFeedbacks(response.data);
        console.log("feedbacks--",feedbacks);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, [doctorId]);

  const handleInputChange = (e) => {
    setNewFeedback(e.target.value);
  };

  const handleAddFeedback = async () => {
    if (newFeedback.trim() === '' || !patientId) {
      return; // Prevent adding empty feedback or if patientId is missing
    }

    try {
      const response = await axios.post(`http://localhost:8000/doctors/${doctorId}/feedback`, {
        patientId,
        comment: newFeedback
      });
      setFeedbacks([...feedbacks, response.data.feedback]);
      setNewFeedback('');
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        height: '74vh',
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
        Feedbacks
      </Typography>
      <Box
        sx={{
          flex: 1,
          overflowY: 'scroll',
          padding: '10px',
        }}
      >
        <ul className='feedbacks_div'>
          {feedbacks.map((feedback) => (
            <li className='feedback' key={feedback._id}>
              <Typography variant="body1" sx={{ mb: 0, display: 'flex', color: '#8c6b52' }}>
                <Icon sx={{ color: '#dfc39c', mr: 1 }}>
                  <KeyboardDoubleArrowRightOutlinedIcon />
                </Icon>
                {feedback.comment}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7d8285', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                By {feedback.patient ? feedback.patient.name : 'Anonymous'}
              </Typography>
              <Divider sx={{ my: 1 }} />
            </li>
          ))}
        </ul>
      </Box>
      {user && user.userLogin && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Input
            placeholder='Add a new feedback'
            value={newFeedback}
            onChange={handleInputChange}
            fullWidth
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={handleAddFeedback}>Add</Button>
        </Box>
      )}
    </Box>
  );
}