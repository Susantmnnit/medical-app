import { Box, Button, Container, Link, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        cpassword: ""
    });
    const navigate = useNavigate();

    const handleInputs = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const PostData = async (e) => {
        e.preventDefault();
        const { name, email, phone, password, cpassword } = user;
        if (!name || !email || !phone || !password || !cpassword) {
            window.alert("Please fill all the fields correctly");
            return;
        }
        try {
            const res = await fetch("http://localhost:8000/signup/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, phone, password, cpassword })
            });

            const data = await res.json();
            if (data.status === 422 || !data) {
                window.alert("Invalid Registration");
            } else {
                window.alert(data.message);
                setIsLogin(true);
            }
        } catch (error) {
            console.log("Error during registration", error);
            window.alert("Error during registration");
        }
    };

    const LoginUser = async (e) => {
        e.preventDefault();
        const { email, password } = user;
        if (!email || !password) {
            window.alert("Invalid Credentials");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/login/", {
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
                navigate("/doctors");
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
                    <h1 style={{ textAlign: "center", color: "#b6b2b2" }}>{isLogin ? 'Patient Login Page' : 'Registeration Page'}</h1>
                    {isLogin ? (
                        <form method='POST' className="register-form">
                            <TextField style={{ padding: "9px" }} type="text" name="email" value={user.email} onChange={handleInputs} label="Email" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="password" name="password" value={user.password} onChange={handleInputs} label="Password" autoComplete="off" fullWidth />
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Button className="button" type="submit" onClick={LoginUser} style={{ borderRadius: "20px" }}>Login</Button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", cursor: "pointer" }}>or <Link onClick={handleToggle}>Register</Link></div>
                        </form>
                    ) : (
                        <form method='POST' className="register-form">
                            <TextField style={{ padding: "9px" }} type="text" name="name" value={user.name} onChange={handleInputs} label="Name" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="text" name="email" value={user.email} onChange={handleInputs} label="Email" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="text" name="phone" value={user.phone} onChange={handleInputs} label="Phone" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="password" name="password" value={user.password} onChange={handleInputs} label="Password" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="password" name="cpassword" value={user.cpassword} onChange={handleInputs} label="Confirm Password" autoComplete="off" fullWidth />
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Button className="button" type="submit" onClick={PostData} style={{ borderRadius: "20px" }}>Register</Button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", cursor: "pointer" }}>or <Link onClick={handleToggle}>Login</Link></div>
                        </form>
                    )}
                </div>
            </Box>
        </Container>
    );
}
