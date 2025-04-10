import React, { useState, useEffect } from 'react';
import { Typography, Container, Paper, Box, Grid, Card, CardContent, Switch, FormControlLabel, TextField, Button, Snackbar, Alert } from '@mui/material';

// Define types for our settings
interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  desktopNotifications: boolean;
}

interface CompanyInformation {
  companyName: string;
  adminEmail: string;
}

interface SettingsState {
  userPreferences: UserPreferences;
  companyInformation: CompanyInformation;
}

const Settings = () => {
  // Initialize state with default values
  const [settings, setSettings] = useState<SettingsState>({
    userPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      desktopNotifications: false
    },
    companyInformation: {
      companyName: "Your Company",
      adminEmail: "admin@example.com"
    }
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('custorix_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Handle preference changes
  const handlePreferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSettings({
      ...settings,
      userPreferences: {
        ...settings.userPreferences,
        [name]: checked
      }
    });
  };

  // Handle company information changes
  const handleCompanyInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSettings({
      ...settings,
      companyInformation: {
        ...settings.companyInformation,
        [name]: value
      }
    });
  };

  // Save settings to localStorage
  const handleSaveSettings = () => {
    try {
      localStorage.setItem('custorix_settings', JSON.stringify(settings));
      setSnackbar({
        open: true,
        message: 'Settings saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSnackbar({
        open: true,
        message: 'Error saving settings. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

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
                    control={
                      <Switch 
                        checked={settings.userPreferences.emailNotifications} 
                        onChange={handlePreferenceChange}
                        name="emailNotifications"
                      />
                    } 
                    label="Email notifications" 
                  />
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={settings.userPreferences.smsNotifications} 
                        onChange={handlePreferenceChange}
                        name="smsNotifications"
                      />
                    } 
                    label="SMS notifications" 
                  />
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={settings.userPreferences.desktopNotifications} 
                        onChange={handlePreferenceChange}
                        name="desktopNotifications"
                      />
                    } 
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
                    name="companyName"
                    value={settings.companyInformation.companyName}
                    onChange={handleCompanyInfoChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Admin Email"
                    name="adminEmail"
                    value={settings.companyInformation.adminEmail}
                    onChange={handleCompanyInfoChange}
                    margin="normal"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSaveSettings}
              >
                Save Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
