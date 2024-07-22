import { Box, Button, Container, Link, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Doctorlogin() {
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

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

            if (res.status === 400 || !data) {
                window.alert("Invalid Credentials");
            } else {
                //window.alert("Login successful");
              localStorage.setItem('Data', JSON.stringify(data));
                console.log(data);
                const doctor_id = data.doctorLogin._id;
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
