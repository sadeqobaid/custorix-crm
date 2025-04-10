import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Container,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();

  const handleLoginAgain = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Thank you for using our CRM - Custorix
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <Typography variant="body1" paragraph>
            You have been successfully logged out.
          </Typography>
          <Typography variant="body1" paragraph>
            We appreciate your business and look forward to serving you again.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleLoginAgain}
          sx={{ mt: 2 }}
        >
          Login Again
        </Button>
      </Paper>
    </Container>
  );
};

export default ThankYou;
