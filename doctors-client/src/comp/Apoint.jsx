import React from 'react'
import { useSelector } from 'react-redux';
import Apointments from './Apointments';

export default function Apoint() {
    const Patient = useSelector(state => state.patients);
    return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',padding:'20px',width:'100vh'}}>
            <Apointments userId={Patient._id} />
        </div>
    </div>
  )
}
