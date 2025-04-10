import React from 'react';
import { Typography, Container, Paper, Box, Grid, Card, CardContent, Switch, FormControlLabel, TextField, Button } from '@mui/material';

const Settings = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          System Settings
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Preferences
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel 
                    control={<Switch defaultChecked />} 
                    label="Email notifications" 
                  />
                  <FormControlLabel 
                    control={<Switch defaultChecked />} 
                    label="SMS notifications" 
                  />
                  <FormControlLabel 
                    control={<Switch />} 
                    label="Desktop notifications" 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Company Information
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    defaultValue="Your Company"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Admin Email"
                    defaultValue="admin@example.com"
                    margin="normal"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary">
                Save Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Settings;
