import { Box, Button, Container, Link, TextField } from '@mui/material'
import React, { useState } from 'react'

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        cpassword: ""
      });
    
      const handleInputs = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
      };

    const PostData = async (e) => {
    e.preventDefault();
    }
    const LoginUser=async (e)=>{
        e.preventDefault();
    }

    const handleToggle = () => {
        setIsLogin(!isLogin); // Toggle between login and signup mode
      };
  return (
    <Container maxWidth="sm">
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="form-container">
          <h1 style={{textAlign:"center",color: "#b6b2b2"}}>{isLogin ? 'Login' : 'Register'}</h1>
          {isLogin ? (
            <form method='POST' className="register-form">
              <TextField style={{padding: "9px"}} type="text" name="email" value={user.email} onChange={handleInputs} label="Email" autoComplete="off" fullWidth />
              <TextField style={{padding: "9px"}} type="password" name="password" value={user.password} onChange={handleInputs} label="Password" autoComplete="off" fullWidth />
              <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <Button className="button" type="submit" onClick={LoginUser} style={{borderRadius:"20px"}}>Login</Button>
              </div>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",cursor:"pointer"}}>or <Link onClick={handleToggle}>Register</Link></div>
            </form>
          ) : (
            <form method='POST' className="register-form">
              <TextField style={{padding: "9px"}} type="text" name="name" value={user.name} onChange={handleInputs} label="Name" autoComplete="off" fullWidth />
              <TextField style={{padding: "9px"}} type="text" name="email" value={user.email} onChange={handleInputs} label="Email" autoComplete="off" fullWidth />
              <TextField style={{padding: "9px"}} type="text" name="phone" value={user.phone} onChange={handleInputs} label="Phone" autoComplete="off" fullWidth />
              <TextField style={{padding: "9px"}} type="password" name="password" value={user.password} onChange={handleInputs} label="Password" autoComplete="off" fullWidth />
              <TextField style={{padding: "9px"}} type="password" name="cpassword" value={user.cpassword} onChange={handleInputs} label="Confirm Password" autoComplete="off" fullWidth />
              <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <Button className="button" type="submit" onClick={PostData} style={{borderRadius:"20px"}}>Register</Button>
              </div>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",cursor:"pointer"}}>or <Link onClick={handleToggle}>Login</Link></div>
            </form>
          )}
        </div>
      </Box>
    </Container>
  )
}