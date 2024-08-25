import * as React from 'react';
import { motion } from "framer-motion";
import { Typography, Button, Card, CardActions, CardContent, Container, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

export default function Homeview() {
    const navigate = useNavigate();

    const user = localStorage.getItem("Data")
        ? JSON.parse(localStorage.getItem("Data"))
        : null;
    
    const handleLoginClick = () => {
        if (user) {
            navigate("/doctors");
        } else {
            navigate("/login");
        }
    };

    return (
        <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Card sx={{ minWidth: 500, height: 350, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRadius: "20px", boxShadow: 3, p: 2 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="center" mb={2}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                            >
                                <Typography variant="h4" color="text.primary" gutterBottom>
                                    Welcome, User
                                </Typography>
                            </motion.div>
                        </Box>
                        <Box display="flex" justifyContent="center" mb={2}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 1 }}
                            >
                                <Typography variant="h5" color="text.secondary">
                                    Let Us Know Your Problems
                                </Typography>
                            </motion.div>
                        </Box>
                    </CardContent>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15,duration: 1, delay: 1.5 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <CardActions>
                            <Button variant="contained" color="primary" endIcon={<SendIcon />} onClick={handleLoginClick} sx={{ textTransform: 'none', px: 4, py: 1.5, borderRadius: '50px' }}>
                                Let's See a Doctor
                            </Button>
                        </CardActions>
                    </motion.div>
                </Card>
            </motion.div>
        </Container>
    );
}