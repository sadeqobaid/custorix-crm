import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { accountsAPI } from '../api/apiService';

const Accounts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    account_name: '',
    account_number: '',
    industry: '',
    website: '',
    phone: '',
    description: '',
    status: 'Active'
  });

  // Fetch accounts from API
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await accountsAPI.getAccounts();
      console.log('Fetched accounts:', response.data);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load accounts',
        severity: 'error'
      });
      // Use dummy data as fallback
      const dummyAccounts = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        account_name: `Account ${i + 1}`,
        account_number: `ACC-${1000 + i}`,
        industry: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail'][i % 5],
        website: `https://example${i + 1}.com`,
        phone: `(555)  ${100 + i}-${1000 + i}`,
        status: ['Active', 'Inactive'][i % 2],
        created_at: new Date().toISOString()
      }));
      setAccounts(dummyAccounts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', account?: any) => {
    setFormMode(mode);
    setFormErrors({});
    if (account) {
      setCurrentAccount(account);
      setFormData({
        account_name: account.account_name || '',
        account_number: account.account_number || '',
        industry: account.industry || '',
        website: account.website || '',
        phone: account.phone || '',
        description: account.description || '',
        status: account.status || 'Active'
      });
    } else {
      setCurrentAccount(null);
      setFormData({
        account_name: '',
        account_number: '',
        industry: '',
        website: '',
        phone: '',
        description: '',
        status: 'Active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user selects
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.account_name.trim()) {
      errors.account_name = 'Account Name is required';
    }
    
    if (!formData.account_number.trim()) {
      errors.account_number = 'Account Number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    
    // Validate form
    if (!validateForm()) {
      console.log('Form validation failed', formErrors);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare data for API
      const accountData = {
        ...formData
      };
      
      console.log('Submitting account data:', accountData);
      
      if (formMode === 'create') {
        // Create new account
        const response = await accountsAPI.createAccount(accountData);
        console.log('Create account response:', response.data);
        
        // Refresh accounts list
        await fetchAccounts();
        
        setSnackbar({
          open: true,
          message: 'Account created successfully',
          severity: 'success'
        });
      } else if (formMode === 'edit' && currentAccount) {
        // Update existing account
        const response = await accountsAPI.updateAccount(currentAccount.id, accountData);
        console.log('Update account response:', response.data);
        
        // Refresh accounts list
        await fetchAccounts();
        
        setSnackbar({
          open: true,
          message: 'Account updated successfully',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving account:', error);
      
      // Handle validation errors from backend
      if (error.response?.data) {
        console.error('Backend validation errors:', error.response.data);
        
        // Map backend errors to form fields
        const backendErrors = error.response.data;
        const formattedErrors: {[key: string]: string} = {};
        
        Object.keys(backendErrors).forEach(key => {
          formattedErrors[key] = Array.isArray(backendErrors[key]) 
            ? backendErrors[key][0] 
            : backendErrors[key];
        });
        
        setFormErrors(formattedErrors);
      }
      
      setSnackbar({
        open: true,
        message: 'Failed to save account: ' + (error.response?.data?.detail || error.message || 'Unknown error'),
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Delete account via API
      await accountsAPI.deleteAccount(id.toString());
      
      // Refresh accounts list
      await fetchAccounts();
      
      setSnackbar({
        open: true,
        message: 'Account deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete account',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Accounts
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
        >
          New Account
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account Name</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.length > 0 ? (
                accounts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.account_name}</TableCell>
                      <TableCell>{account.account_number}</TableCell>
                      <TableCell>{account.industry}</TableCell>
                      <TableCell>{account.website}</TableCell>
                      <TableCell>{account.phone}</TableCell>
                      <TableCell>{account.status}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog('view', account)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog('edit', account)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(account.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No accounts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={accounts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Account Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {formMode === 'create' ? 'Create Account' : 
           formMode === 'edit' ? 'Edit Account' : 'View Account'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="account_name"
                label="Account Name"
                fullWidth
                value={formData.account_name}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
                required
                error={!!formErrors.account_name}
                helperText={formErrors.account_name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="account_number"
                label="Account Number"
                fullWidth
                value={formData.account_number}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
                required
                error={!!formErrors.account_number}
                helperText={formErrors.account_number}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="industry"
                label="Industry"
                fullWidth
                value={formData.industry}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
                error={!!formErrors.industry}
                helperText={formErrors.industry}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="website"
                label="Website"
                fullWidth
                value={formData.website}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
                error={!!formErrors.website}
                helperText={formErrors.website}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.status}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  disabled={formMode === 'view'}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
                {formErrors.status && <FormHelperText>{formErrors.status}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {formMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {formMode !== 'view' && (
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : formMode === 'create' ? 'Create Account' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

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

export default Accounts;
