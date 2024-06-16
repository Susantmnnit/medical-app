import { Button } from '@mui/material';
import axios from 'axios';
import React from 'react';

export default function Slots({ slots,doctorId }) {
    const user = localStorage.getItem("Data") ? JSON.parse(localStorage.getItem("Data")) : null;
    const token = user.token;
    console.log("toekn-", token);
    
    const bookSlot = async (slotId) => {
        const patientId = user.userLogin._id;
        try {
        const response = await axios.post(`http://localhost:8000/doctors/${doctorId}/slots/${slotId}/book`, {patientId});
        console.log('Slot booked successfully:', response.data);
        
        } catch (error) {
        console.error('Error booking slot:', error);
        }
    };

  return (
    <div className="slots-container">
          <h3 className='slot-header-text'>{user.userLogin ? "Book an apointment" : "Added slots"}</h3>
      {slots.map(slot => (
          <div key={slot._id} className="slot-card">
            <div className='slot-head'>
                <div className="slot-date">
                    <strong>Date:</strong> {new Date(slot.date).toLocaleDateString()}
                </div>
                <div className="slot-time">
                    <strong>Time:</strong> {slot.startTime} - {slot.endTime}
                </div>
                <div className="slot-status">
                    <strong>Status:</strong> {slot.isBooked ? <p style={{ color: 'red' }}>Booked</p> : <p style={{ color: 'green' }}>Available</p>}
                </div>
            </div>
              <div className="slot_book">
            {!slot.isBooked && user.userLogin && 
                <Button className='doctor_button' sx={{ backgroundColor: '#629d62', margin: '9px', color: 'white' }} onClick={() => bookSlot(slot._id)}>Book slot</Button>
            }
            </div>
        </div>
      ))}
    </div>
  );
}
