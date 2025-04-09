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
  Chip,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Skeleton,
  LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { opportunitiesAPI, accountsAPI, contactsAPI } from '../api/apiService';

// Form validation interface
interface FormErrors {
  name?: string;
  amount?: string;
  account?: string;
  sales_stage?: string;
  close_date?: string;
}

const Opportunities: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [salesStages, setSalesStages] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentOpportunity, setCurrentOpportunity] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    account: '',
    contact: '',
    sales_stage: '',
    close_date: '',
    probability: 0,
    description: ''
  });

  // Fetch opportunities and reference data from API
  const fetchOpportunities = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await opportunitiesAPI.getOpportunities();
      console.log('Fetched opportunities:', response.data);
      setOpportunities(response.data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setLoadError('Failed to load opportunities. Please try again.');
      // Use dummy data as fallback
      const dummyOpportunities = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `Opportunity ${i + 1}`,
        amount: (10000 * (i + 1)).toFixed(2),
        account: {
          id: i + 1,
          account_name: `Account ${i + 1}`
        },
        contact: {
          id: i + 1,
          first_name: ['John', 'Jane', 'Michael', 'Sarah', 'David'][i],
          last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i]
        },
        sales_stage: {
          id: i + 1,
          name: ['Prospecting', 'Qualification', 'Needs Analysis', 'Value Proposition', 'Decision Makers'][i]
        },
        close_date: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        probability: (i + 1) * 20,
        created_at: new Date().toISOString()
      }));
      setOpportunities(dummyOpportunities);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      // Fetch accounts
      const accountsResponse = await accountsAPI.getAccounts();
      setAccounts(accountsResponse.data);
      
      // Fetch contacts
      const contactsResponse = await contactsAPI.getContacts();
      setContacts(contactsResponse.data);
      
      // Fetch sales stages
      const salesStagesResponse = await opportunitiesAPI.getSalesStages();
      setSalesStages(salesStagesResponse.data);
    } catch (error) {
      console.error('Error fetching reference data:', error);
      // Use dummy data as fallback
      setAccounts(Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        account_name: `Account ${i + 1}`
      })));
      
      setContacts(Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        first_name: ['John', 'Jane', 'Michael', 'Sarah', 'David'][i],
        last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i]
      })));
      
      setSalesStages(Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: ['Prospecting', 'Qualification', 'Needs Analysis', 'Value Proposition', 'Decision Makers'][i]
      })));
    }
  };

  useEffect(() => {
    fetchOpportunities();
    fetchReferenceData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', opportunity?: any) => {
    setFormMode(mode);
    setFormErrors({});
    
    if (opportunity) {
      setCurrentOpportunity(opportunity);
      setFormData({
        name: opportunity.name,
        amount: opportunity.amount.toString(),
        account: opportunity.account.id,
        contact: opportunity.contact?.id || '',
        sales_stage: opportunity.sales_stage.id,
        close_date: opportunity.close_date,
        probability: opportunity.probability || 0,
        description: opportunity.description || ''
      });
    } else {
      setCurrentOpportunity(null);
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        name: '',
        amount: '',
        account: accounts.length > 0 ? accounts[0].id : '',
        contact: '',
        sales_stage: salesStages.length > 0 ? salesStages[0].id : '',
        close_date: today,
        probability: 0,
        description: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is edited
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is edited
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Opportunity name is required';
    }
    
    if (!formData.amount.trim()) {
      errors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.account) {
      errors.account = 'Account is required';
    }
    
    if (!formData.sales_stage) {
      errors.sales_stage = 'Sales stage is required';
    }
    
    if (!formData.close_date) {
      errors.close_date = 'Close date is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please correct the errors in the form',
        severity: 'error'
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare data for API
      const opportunityData = {
        ...formData,
        amount: parseFloat(formData.amount),
        probability: parseInt(formData.probability.toString(), 10)
      };
      
      console.log('Submitting opportunity data:', opportunityData);
      
      if (formMode === 'create') {
        // Create new opportunity
        const response = await opportunitiesAPI.createOpportunity(opportunityData);
        console.log('Create opportunity response:', response.data);
        
        // Refresh opportunities list
        await fetchOpportunities();
        
        setSnackbar({
          open: true,
          message: 'Opportunity created successfully',
          severity: 'success'
        });
      } else if (formMode === 'edit' && currentOpportunity) {
        // Update existing opportunity
        const response = await opportunitiesAPI.updateOpportunity(currentOpportunity.id, opportunityData);
        console.log('Update opportunity response:', response.data);
        
        // Refresh opportunities list
        await fetchOpportunities();
        
        setSnackbar({
          open: true,
          message: 'Opportunity updated successfully',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving opportunity:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save opportunity',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Delete opportunity via API
      await opportunitiesAPI.deleteOpportunity(id.toString());
      
      // Refresh opportunities list
      await fetchOpportunities();
      
      setSnackbar({
        open: true,
        message: 'Opportunity deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete opportunity',
        severity: 'error'
      });
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Prospecting':
        return 'info';
      case 'Qualification':
        return 'primary';
      case 'Needs Analysis':
        return 'warning';
      case 'Value Proposition':
        return 'success';
      case 'Decision Makers':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
        
        <LinearProgress sx={{ mb: 2 }} />
        
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={40} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    );
  }

  // Error state
  if (loadError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Data
          </Typography>
          <Typography variant="body1" paragraph>
            {loadError}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={fetchOpportunities}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Opportunities
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
        >
          New Opportunity
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Close Date</TableCell>
                <TableCell>Probability</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {opportunities.length > 0 ? (
                opportunities
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((opportunity) => (
                    <TableRow key={opportunity.id}>
                      <TableCell>{opportunity.name}</TableCell>
                      <TableCell>{formatCurrency(opportunity.amount)}</TableCell>
                      <TableCell>{opportunity.account?.account_name || 'N/A'}</TableCell>
                      <TableCell>
                        {opportunity.contact ? 
                          `${opportunity.contact.first_name} ${opportunity.contact.last_name}` : 
                          'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={opportunity.sales_stage?.name || 'N/A'} 
                          color={getStageColor(opportunity.sales_stage?.name) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{opportunity.close_date}</TableCell>
                      <TableCell>{`${opportunity.probability}%`}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog('view', opportunity)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog('edit', opportunity)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(opportunity.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No opportunities found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={opportunities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Opportunity Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        disableEscapeKeyDown={submitting}
      >
        <DialogTitle>
          {formMode === 'create' ? 'Create Opportunity' : 
           formMode === 'edit' ? 'Edit Opportunity' : 'View Opportunity'}
        </DialogTitle>
        {submitting && <LinearProgress />}
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Opportunity Name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                disabled={formMode === 'view' || submitting}
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="amount"
                label="Amount"
                fullWidth
                value={formData.amount}
                onChange={handleInputChange}
                disabled={formMode === 'view' || submitting}
                required
                error={!!formErrors.amount}
                helperText={formErrors.amount}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                disabled={formMode === 'view' || submitting}
                error={!!formErrors.account}
              >
                <InputLabel>Account</InputLabel>
                <Select
                  name="account"
                  value={formData.account}
                  label="Account"
                  onChange={handleSelectChange}
                  required
                >
                  {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.account_name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.account && (
                  <Typography variant="caption" color="error">
                    {formErrors.account}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                disabled={formMode === 'view' || submitting}
              >
                <InputLabel>Contact</InputLabel>
                <Select
                  name="contact"
                  value={formData.contact}
                  label="Contact"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {contacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {`${contact.first_name} ${contact.last_name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                disabled={formMode === 'view' || submitting}
                error={!!formErrors.sales_stage}
              >
                <InputLabel>Sales Stage</InputLabel>
                <Select
                  name="sales_stage"
                  value={formData.sales_stage}
                  label="Sales Stage"
                  onChange={handleSelectChange}
                  required
                >
                  {salesStages.map((stage) => (
                    <MenuItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.sales_stage && (
                  <Typography variant="caption" color="error">
                    {formErrors.sales_stage}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="close_date"
                label="Close Date"
                type="date"
                fullWidth
                value={formData.close_date}
                onChange={handleInputChange}
                disabled={formMode === 'view' || submitting}
                required
                error={!!formErrors.close_date}
                helperText={formErrors.close_date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="probability"
                label="Probability (%)"
                type="number"
                fullWidth
                value={formData.probability}
                onChange={handleInputChange}
                disabled={formMode === 'view' || submitting}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
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
                disabled={formMode === 'view' || submitting}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            disabled={submitting}
          >
            {formMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {formMode !== 'view' && (
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  {formMode === 'create' ? 'Creating...' : 'Saving...'}
                </>
              ) : (
                formMode === 'create' ? 'Create Opportunity' : 'Save Changes'
              )}
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

export default Opportunities;
