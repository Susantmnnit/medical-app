import { Box, Button, Container, Link, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { redirect_to_dashboard_doctors } from '../redux/Doctorslice';

export default function Doctorlogin() {
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.doctors.token !== null);
    // useSelector((state) => {
    //     console.log(state);
    // });
    const doctor_id = useSelector((state) => state.doctors._id);
    
    const handleInputs = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const LoginUser = async (e) => {
        e.preventDefault();
        const { email, password } = user;
        if (!email || !password) {
            window.alert("Invalid Credentials");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/doctorlogin/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            // console.log("data--", data.data);
            if (res.status === 400 || !data) {
                window.alert("Invalid Credentials");
            } else {
                //window.alert("Login successful");
                localStorage.setItem('token', data.data.token);
                dispatch(redirect_to_dashboard_doctors({
                    _id: data.data.doctorLogin._id,
                    token: data.data.token,
                    name: data.data.doctorLogin.name,
                    email: data.data.doctorLogin.email,
                    address: data.data.doctorLogin.address,
                    city: data.data.doctorLogin.city,
                    pin: data.data.doctorLogin.pin,
                    clinic_name: data.data.doctorLogin.clinic_name,
                    phone: data.data.doctorLogin.phone,
                    specalist: data.data.doctorLogin.specalist,
                }));
                const doctor_id = data.data.doctorLogin._id;
                // // console.log("dosctors_id-",doctor_id);
                navigate(`/doctorsprofile/${doctor_id}`);
            }
        } catch (error) {
            console.log("Error logging in", error);
            window.alert("Error logging in");
        }
    };

    const handleToggle = () => {
        setIsLogin(!isLogin);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="form-container">
                    <h1 style={{ textAlign: "center", color: "#b6b2b2" }}>Login Doctor</h1>
                        <form method='POST' className="register-form">
                            <TextField style={{ padding: "9px" }} type="text" name="email" value={user.email} onChange={handleInputs} label="Email" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="password" name="password" value={user.password} onChange={handleInputs} label="Password" autoComplete="off" fullWidth />
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Button className="button" type="submit" onClick={LoginUser} style={{ borderRadius: "20px" }}>Login</Button>
                            </div>
                        </form>
                </div>
            </Box>
        </Container>
    );
}
