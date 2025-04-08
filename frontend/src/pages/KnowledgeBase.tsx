import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';

const KnowledgeBase = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Knowledge Base
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Access your company's knowledge base here. This module provides a centralized repository
            for documentation, FAQs, troubleshooting guides, and best practices to help support
            your team and customers.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default KnowledgeBase;
