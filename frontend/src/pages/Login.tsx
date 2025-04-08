import React from 'react';
import { Typography, Box, TextField, Button } from '@mui/material';

const Login = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
        />
        <Button 
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
