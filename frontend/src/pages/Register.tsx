import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Container, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
  Grid,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/apiService';

interface FormErrors {
  [key: string]: string;
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Consulting',
  'Real Estate',
  'Transportation',
  'Energy',
  'Other'
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees'
];

// List of all countries for dropdown
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo', 
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 
  'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 
  'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Company Information
    companyName: '',
    jobTitle: '',
    industry: '',
    companySize: '',
    
    // Additional Information
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    comments: ''
  });

  const steps = ['Basic Information', 'Company Information', 'Additional Information'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Clear general error when form is edited
    if (error) {
      setError('');
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is selected
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Clear general error when form is edited
    if (error) {
      setError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate only the basic information fields
  const validateBasicInfo = (): boolean => {
    const errors: FormErrors = {};
    
    // Validate Basic Information
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      errors.username = 'Username must be at least 4 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // No validation for other steps - they're all optional
  const handleNext = () => {
    // Only validate the first step (Basic Information)
    if (activeStep === 0) {
      if (validateBasicInfo()) {
        setActiveStep(1);
      }
    } else {
      // For other steps, just proceed without validation
      setActiveStep(activeStep + 1);
    }
    
    // Clear any error messages when moving between steps
    setError('');
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    // Clear any error messages when moving between steps
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate basic information before submission
    if (!validateBasicInfo()) {
      setActiveStep(0); // Go back to basic info step if validation fails
      setError('Please complete all required fields in Basic Information');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Prepare registration data (excluding confirmPassword)
      const { confirmPassword, ...registrationData } = formData;
      
      // Log the data being sent to the API
      console.log('Sending registration data to API:', registrationData);
      
      // Call the API to register the user
      const response = await authAPI.register(registrationData);
      console.log('Registration API response:', response);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Registration successful! You can now log in.',
        severity: 'success'
      });
      
      // Attempt to automatically log in the user
      try {
        const loginResponse = await authAPI.login({
          username: formData.username,
          password: formData.password
        });
        console.log('Auto-login successful:', loginResponse);
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (loginError) {
        console.error('Auto-login failed:', loginError);
        // If auto-login fails, redirect to login page
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.data) {
        // Handle validation errors from backend
        const backendErrors = error.response.data;
        console.error('Backend validation errors:', backendErrors);
        
        const formattedErrors: FormErrors = {};
        
        // Check if backendErrors is an object with field-specific errors
        if (typeof backendErrors === 'object' && backendErrors !== null) {
          Object.keys(backendErrors).forEach(key => {
            formattedErrors[key] = Array.isArray(backendErrors[key]) 
              ? backendErrors[key][0] 
              : backendErrors[key];
          });
        } else if (error.response?.data?.error) {
          // If there's a general error message
          setError(error.response.data.error);
        } else {
          setError('There was a problem with your registration. Please try again.');
        }
        
        setFormErrors(formattedErrors);
        
        // Check if errors are in basic information fields
        const basicInfoFields = ['fullName', 'username', 'email', 'password', 'confirmPassword', 'phone'];
        const hasBasicInfoErrors = Object.keys(formattedErrors).some(
          key => basicInfoFields.includes(key)
        );
        
        if (hasBasicInfoErrors) {
          setActiveStep(0); // Go back to basic info step
        }
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldsForStep = (step: number): string[] => {
    if (step === 0) {
      return ['fullName', 'username', 'email', 'password', 'confirmPassword', 'phone'];
    } else if (step === 1) {
      return ['companyName', 'jobTitle', 'industry', 'companySize'];
    } else {
      return ['address', 'city', 'state', 'zipCode', 'country', 'comments'];
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                error={!!formErrors.fullName}
                helperText={formErrors.fullName}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                error={!!formErrors.username}
                helperText={formErrors.username}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                error={!!formErrors.password}
                helperText={formErrors.password}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                disabled={loading}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                error={!!formErrors.companyName}
                helperText={formErrors.companyName}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                error={!!formErrors.jobTitle}
                helperText={formErrors.jobTitle}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.industry} disabled={loading}>
                <InputLabel id="industry-label">Industry</InputLabel>
                <Select
                  labelId="industry-label"
                  name="industry"
                  value={formData.industry}
                  onChange={handleSelectChange}
                  label="Industry"
                >
                  {industries.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.industry && <FormHelperText>{formErrors.industry}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.companySize} disabled={loading}>
                <InputLabel id="company-size-label">Company Size</InputLabel>
                <Select
                  labelId="company-size-label"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleSelectChange}
                  label="Company Size"
                >
                  {companySizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.companySize && <FormHelperText>{formErrors.companySize}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={!!formErrors.city}
                helperText={formErrors.city}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                error={!!formErrors.state}
                helperText={formErrors.state}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ZIP/Postal Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                error={!!formErrors.zipCode}
                helperText={formErrors.zipCode}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.country} disabled={loading}>
                <InputLabel id="country-label">Country</InputLabel>
                <Select
                  labelId="country-label"
                  name="country"
                  value={formData.country}
                  onChange={handleSelectChange}
                  label="Country"
                >
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.country && <FormHelperText>{formErrors.country}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Comments"
                name="comments"
                multiline
                rows={4}
                value={formData.comments}
                onChange={handleInputChange}
                error={!!formErrors.comments}
                helperText={formErrors.comments}
                disabled={loading}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Custorix CRM
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box component="form" onSubmit={(e) => {
          e.preventDefault();
          if (activeStep === steps.length - 1) {
            handleSubmit(e);
          } else {
            handleNext();
          }
        }}>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              Developed by Sadeq Obaid
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                Login
              </Link>
            </Typography>
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

export default Register;
