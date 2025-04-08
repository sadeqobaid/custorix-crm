import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';

const Reports = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Access analytics and reporting here. This module provides comprehensive insights into
            your business performance, sales pipeline, marketing effectiveness, and customer
            support metrics.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Reports;
