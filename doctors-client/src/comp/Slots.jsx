import { Button } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';

export default function Slots({ slots, doctorId }) {
    const isAuthenticatedPatients = useSelector(
    (state) => state.patients.token !== null
    );
    const isAuthenticatedDoctors = useSelector(
    (state) => state.doctors.token !== null
    );
    
    const user = useSelector((state) => state.patients);
    const doctor = useSelector((state) => state.doctors);
    const token = user.token;
    // console.log("toekn-", token);
    
    const bookSlot = async (slotId) => {
        const patientId = user._id;
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/doctors/${doctorId}/slots/${slotId}/book`, { patientId });
            if (response.status === 409) {
                console.log(response.error);
            }
            alert("slot booked successfully");
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                alert(`Error booking slot: ${error.response.data.error}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                alert("Error booking slot: No response from server");
            } else {
                console.error('Error message:', error.message);
                alert(`Error booking slot: ${error.message}`);
            }
        }
    };

    const deleteSlot = async (slotId) => {
        const patientId = doctor._id;
        try {
        const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/deleteSlot/${doctorId}/${slotId}`, {patientId});
        console.log('Slot deleted successfully:', response.data);
        
        } catch (error) {
        console.error('Error booking slot:', error);
        }
    };

  return (
    <div className="slots-container">
          <h3 className='slot-header-text'>{isAuthenticatedPatients ? "Book an apointment" : "Added slots"}</h3>
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
                {!slot.isBooked && isAuthenticatedPatients &&
                    <Button className='doctor_button' sx={{ backgroundColor: '#629d62', margin: '9px', color: 'white' }} onClick={() => bookSlot(slot._id)}>Book slot</Button>
                  }
                {isAuthenticatedDoctors &&
                    <Button className='doctor_button' sx={{ backgroundColor: '#629d62', margin: '9px', color: 'white' }} onClick={() => deleteSlot(slot._id)}>Delete slot</Button>
                  }
            </div>
        </div>
      ))}
    </div>
  );
}
