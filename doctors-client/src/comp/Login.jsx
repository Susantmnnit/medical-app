import { Box, Button, Container, Link, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { redirect_to_dashboard } from '../redux/Patientslice';
import { useDispatch, useSelector } from 'react-redux';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        bloodgroup: "",
        address: "",
        problems: "",
        password: "",
        cpassword: ""
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.patients.token !== null);
//   useSelector((state)=>{
//     console.log(state);
//   })

    const handleInputs = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const PostData = async (e) => {
        e.preventDefault();
        const { name, email, phone, age, bloodgroup, address, problems, password, cpassword } = user;
        if (!name || !email || !phone || !age || !bloodgroup || !address || !problems || !password || !cpassword) {
            window.alert("Please fill all the fields correctly");
            return;
        }
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, phone, age, bloodgroup, address, problems, password, cpassword })
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
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            // console.log("data----",data.data)
            if (res.status === 400 || !data) {
                window.alert("Invalid Credentials");
            } else {
                localStorage.setItem('token', data.data.token);
                dispatch(redirect_to_dashboard({
                    _id: data.data.userLogin._id,
                    token: data.data.userLogin.token,
                    name: data.data.userLogin.name,
                    email: data.data.userLogin.email,
                    address: data.data.userLogin.address,
                    age: data.data.userLogin.age,
                    bloodgroup: data.data.userLogin.bloodgroup,
                    problems: data.data.userLogin.problems,
                    phone: data.data.userLogin.phone,
              }));
                // console.log(data);
                navigate("/");
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
                    <h1 style={{ textAlign: "center", color: "#b6b2b2" }}>{isLogin ? 'Patient Login Page' : 'Registration Page'}</h1>
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
                        <form method='POST' className="register-form" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <TextField style={{ padding: "9px" }} type="text" name="name" value={user.name} onChange={handleInputs} label="Name" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="text" name="email" value={user.email} onChange={handleInputs} label="Email" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="text" name="phone" value={user.phone} onChange={handleInputs} label="Phone" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="text" name="age" value={user.age} onChange={handleInputs} label="Age" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="text" name="bloodgroup" value={user.bloodgroup} onChange={handleInputs} label="Blood group" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="text" name="address" value={user.address} onChange={handleInputs} label="Address" autoComplete="off" fullWidth />
                            <TextField style={{ padding: "9px" }} type="text" name="problems" value={user.problems} onChange={handleInputs} label="Problems" autoComplete="off" fullWidth />
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
