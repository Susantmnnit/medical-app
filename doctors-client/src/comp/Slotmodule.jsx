import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Slots from './Slots'
import { useSelector } from 'react-redux';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import SlotModal from './Slotmodal';

export default function Slotmodule() {
    const doctor = useSelector((state) => state.doctors);
    const [slots, setSlots] = useState([]);
    useEffect(() => {
        handleDoctorsDetails();
    },[doctor._id]);

    const handleDoctorsDetails = async (req, res) => {
        try {
        const new_doctor = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getdoctorwithid/${doctor._id}`);
        setSlots(new_doctor.data.slots);
        // console.log(doctor);
        } catch (err) {
        console.log(err);
        }
    }
    const [showModal, setShowModal] = useState(false);
  
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    
    return (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <div className="added-slots">
                <div className="doctorpatient">
                    <Button
            className='doctor_button'
                sx={{ backgroundColor: '#f59f43eb', margin: '9px', color: 'white' }}
                onClick={handleOpenModal}
                    >
                        <AddIcon/>
            Add Slots
                </Button>
                </div>
                <Slots slots={slots} doctorId={doctor._id} />
                <SlotModal show={showModal} handleClose={handleCloseModal} doctorId={doctor._id} />
            </div>
        </div>
    )
}
