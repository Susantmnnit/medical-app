import React, { useState } from 'react';
import { Box, Button, Icon, Typography, Input, Divider } from '@mui/material';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, text: 'Good enough to explain all rjidnn juud', author: 'Rohit' },
      { id: 2, text: 'Another feedback example', author: 'John' },
      { id: 1, text: 'Good enough to explain all rjidnn juud', author: 'Rohit' },
      { id: 1, text: 'Good enough to explain all rjidnn juud', author: 'Rohit' },
      { id: 1, text: 'Good enough to explain all rjidnn juud', author: 'Rohit' },
      { id: 1, text: 'Good enough to explain all rjidnn juud', author: 'Rohit' },
      { id: 1, text: 'Good enough to explain all rjidnn juud', author: 'Rohit' },
      { id: 1, text: 'Good enough to explain all rjidnn juud', author: 'Rohit' },
    { id: 1, text: 'Good enough to explain all rjidnn juud', author: 'Rohit' }
  ]);

  const user = localStorage.getItem("Data")
    ? JSON.parse(localStorage.getItem("Data"))
    : null;
  
  const [newFeedback, setNewFeedback] = useState('');

  const handleInputChange = (e) => {
    setNewFeedback(e.target.value);
  };

  const handleAddFeedback = () => {
    if (newFeedback.trim() === '') {
      return; // Prevent adding empty feedback
    }
    const newId = feedbacks.length + 1;
    const updatedFeedbacks = [
      ...feedbacks,
      { id: newId, text: newFeedback, author: 'Anonymous' } // Set author as needed
    ];
    setFeedbacks(updatedFeedbacks);
    setNewFeedback('');
  };

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
            <li className='feedback' key={feedback.id}>
              <Typography variant="body1" sx={{ mb: 0, display: 'flex', color: '#8c6b52' }}>
                <Icon sx={{ color: '#dfc39c', mr: 1 }}>
                  <KeyboardDoubleArrowRightOutlinedIcon />
                </Icon>
                {feedback.text}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7d8285', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                By {feedback.author}
              </Typography>
              <Divider sx={{ my: 1 }} />
            </li>
          ))}
        </ul>
      </Box>
      {user.userLogin &&
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
      }
    </Box>
  );
}
