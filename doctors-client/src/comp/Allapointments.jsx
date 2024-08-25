import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, Icon, Typography, Grid, Button } from '@mui/material';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PermPhoneMsgOutlinedIcon from '@mui/icons-material/PermPhoneMsgOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined';
import { useSelector } from 'react-redux';

function Allapointments() {
  const token = localStorage.getItem("token");
  const [slots, setSlots] = useState([]);
    const navigate = useNavigate();
    const userId = useSelector((state) => state.patients._id);
  useEffect(() => {
    // console.log("slots", userId);
    const fetchSlots = async () => {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/patients/bookedSlots`,config
        );
        // console.log("slots", response.data);
        setSlots(response.data);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };

    fetchSlots();
  }, [userId]);

  const gotoroom = (confId) => {
    const conf_id = confId;
    navigate(`/joinconference/${conf_id}`);
  }


  return (
    <div className='patient-div'>
      <h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',color:'#c4c4a5' }}>All Apiontments</h2>
      {slots.length > 0 ? (
        slots.map((slot) => (
          <Card key={slot.patientInfo._id} sx={{ margin: '10px', padding: '10px' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Icon>
                        <AccountCircleOutlinedIcon />
                      </Icon>
                    </Grid>
                    <Grid item>
                      <Typography variant="h5">{slot.doctorInfo.name}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Icon>
                        <MailOutlinedIcon />
                      </Icon>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1">Email: {slot.doctorInfo.name}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Icon>
                        <PermPhoneMsgOutlinedIcon />
                      </Icon>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1">Phone: {slot.doctorInfo.phone}</Typography>
                    </Grid>
                    </Grid>
                    <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Icon>
                        <CoronavirusOutlinedIcon />
                      </Icon>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1" >Specialization:<b style={{color:'#be2b2b'}}>{slot.doctorInfo.specalist}</b></Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                    <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Icon>
                        <DateRangeOutlinedIcon />
                      </Icon>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">Date: {new Date(slot.date).toLocaleDateString()}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Icon>
                        <AccessTimeOutlinedIcon />
                      </Icon>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">Time: {slot.startTime} - {slot.endTime}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                </Grid>
                <div style={{display:'flex',justifyContent:'center'}}>
                    <Button className='doctor_button' sx={{ backgroundColor: '#629d62', margin: '9px', color: 'white' }} onClick={() => gotoroom(slot.conference_slot_id)}>Connect with Doctor</Button> 
                </div>   
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No patients have booked slots.</p>
      )}
    </div>
  );
}

export default Allapointments;
