import * as React from 'react';
import { motion } from "framer-motion";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { Card, CardActions, CardContent} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Homeview() {
    const navigate=useNavigate();

    const user = localStorage.getItem("Data")
    ? JSON.parse(localStorage.getItem("Data"))
    : null;
    const handleLoginClick = () => {
        if (user) {
            navigate("/doctors");
        }
        else {
            navigate("/login");
        }
        // navigate("/userprofile");
    };
    
  return (
    <Card sx={{ minWidth: 500, height:300, display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column",borderRadius:"57px", boxShadow: "0px 4px 8px rgba(11, 10, 10, 0.52)" }}>
        <CardContent>
            <div style={{display: "flex" , justifyContent:"center",alignItems:"center"}}>
            <Typography sx={{ fontSize: 28 }} color="text.secondary" gutterBottom style={{alignItems:'center'}}>
                Wellcome user
            </Typography>
            </div>
            <Typography variant="h5" component="div">
            </Typography>
            <div style={{display: "flex" , justifyContent:"center",alignItems:"center"}}>
            <Typography sx={{ fontSize: 28 }} color="text.secondary" gutterBottom style={{alignItems:'center'}}>
                Let Us Know Your Problems
            </Typography>
            </div>
        </CardContent>
        <motion.div className='button-to-go' whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} whileTap={{ scale: 0.9 }}>
            <CardActions>
            <Button variant="contained" endIcon={<SendIcon />} onClick={handleLoginClick}>
                Let's see a doctor
            </Button>
            </CardActions>
        </motion.div>
    </Card>
  )
}
