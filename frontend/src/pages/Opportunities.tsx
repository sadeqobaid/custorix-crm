import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';

const Opportunities = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Opportunities
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Manage your sales opportunities here. This module will allow you to track potential deals,
            set probability, manage pipeline stages, and forecast revenue.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Opportunities;
