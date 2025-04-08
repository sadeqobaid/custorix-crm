import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';

const Invoices = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Invoices
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Manage your invoices here. This module allows you to create, send, and track invoices,
            as well as monitor payment status and generate financial reports.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Invoices;
