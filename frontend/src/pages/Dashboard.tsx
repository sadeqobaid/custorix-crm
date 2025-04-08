import React from 'react';
import { Typography, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Typography variant="body1">
        Welcome to your CRM Dashboard. Here you'll see key metrics and recent activities.
      </Typography>
    </Box>
  );
};

export default Dashboard;
