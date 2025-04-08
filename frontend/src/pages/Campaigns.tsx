import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';

const Campaigns = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Marketing Campaigns
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Manage your marketing campaigns here. This module will allow you to create, track,
            and analyze marketing initiatives across various channels.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Campaigns;
