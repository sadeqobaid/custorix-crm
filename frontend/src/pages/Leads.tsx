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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  Skeleton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { contactsAPI } from '../api/apiService';

// Add this to your apiService.ts file
// export const leadsAPI = {
//   getLeads: () => apiClient.get('/leads/'),
//   getLead: (id) => apiClient.get(`/leads/${id}/`),
//   createLead: (data) => apiClient.post('/leads/', data),
//   updateLead: (id, data) => apiClient.put(`/leads/${id}/`, data),
//   deleteLead: (id) => apiClient.delete(`/leads/${id}/`),
//   getLeadSources: () => apiClient.get('/lead-sources/'),
//   getLeadStatuses: () => apiClient.get('/lead-statuses/'),
// };

// Import the API service
import { leadsAPI } from '../api/apiService';

// Form validation interface
interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  lead_source?: string;
  status?: string;
}

const Leads: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [leadStatuses, setLeadStatuses] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentLead, setCurrentLead] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    title: '',
    email: '',
    phone: '',
    lead_source: '',
    status: '',
    description: '',
    lead_score: 0
  });

  // Fetch leads and reference data from API
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadsAPI.getLeads();
      console.log('Fetched leads:', response.data);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load leads',
        severity: 'error'
      });
      
      // Use dummy data as fallback
      const dummyLeads = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        first_name: ['John', 'Jane', 'Michael', 'Sarah', 'David'][i],
        last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i],
        company_name: `Company ${i + 1}`,
        title: ['CEO', 'CTO', 'CFO', 'Marketing Director', 'Sales Manager'][i],
        email: `lead${i + 1}@example.com`,
        phone: `(555) ${100 + i}-${1000 + i}`,
        lead_source: {
          id: i + 1,
          name: ['Website', 'Referral', 'Trade Show', 'Social Media', 'Email Campaign'][i]
        },
        status: {
          id: i + 1,
          name: ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'][i]
        },
        lead_score: Math.floor(Math.random() * 100),
        created_at: new Date().toISOString()
      }));
      setLeads(dummyLeads);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadSources = async () => {
    try {
      const response = await leadsAPI.getLeadSources();
      console.log('Fetched lead sources:', response.data);
      setLeadSources(response.data);
    } catch (error) {
      console.error('Error fetching lead sources:', error);
      // Use dummy data as fallback
      const dummySources = [
        { id: 1, name: 'Website' },
        { id: 2, name: 'Referral' },
        { id: 3, name: 'Trade Show' },
        { id: 4, name: 'Social Media' },
        { id: 5, name: 'Email Campaign' }
      ];
      setLeadSources(dummySources);
    }
  };

  const fetchLeadStatuses = async () => {
    try {
      const response = await leadsAPI.getLeadStatuses();
      console.log('Fetched lead statuses:', response.data);
      setLeadStatuses(response.data);
    } catch (error) {
      console.error('Error fetching lead statuses:', error);
      // Use dummy data as fallback
      const dummyStatuses = [
        { id: 1, name: 'New' },
        { id: 2, name: 'Contacted' },
        { id: 3, name: 'Qualified' },
        { id: 4, name: 'Unqualified' },
        { id: 5, name: 'Converted' }
      ];
      setLeadStatuses(dummyStatuses);
    }
  };

  useEffect(() => {
    // Fetch data from API
    fetchLeads();
    fetchLeadSources();
    fetchLeadStatuses();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', lead?: any) => {
    setFormMode(mode);
    setFormErrors({});
    
    if (lead) {
      setCurrentLead(lead);
      setFormData({
        first_name: lead.first_name,
        last_name: lead.last_name,
        company_name: lead.company_name || '',
        title: lead.title || '',
        email: lead.email || '',
        phone: lead.phone || '',
        lead_source: lead.lead_source.id,
        status: lead.status.id,
        description: lead.description || '',
        lead_score: lead.lead_score || 0
      });
    } else {
      setCurrentLead(null);
      setFormData({
        first_name: '',
        last_name: '',
        company_name: '',
        title: '',
        email: '',
        phone: '',
        lead_source: leadSources.length > 0 ? leadSources[0].id : '',
        status: leadStatuses.length > 0 ? leadStatuses[0].id : '',
        description: '',
        lead_score: 0
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
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.lead_source) {
      errors.lead_source = 'Lead source is required';
    }
    
    if (!formData.status) {
      errors.status = 'Status is required';
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
      const leadData = {
        ...formData
      };
      
      console.log('Submitting lead data:', leadData);
      
      if (formMode === 'create') {
        // Create new lead
        const response = await leadsAPI.createLead(leadData);
        console.log('Create lead response:', response.data);
        
        // Refresh leads list
        await fetchLeads();
        
        setSnackbar({
          open: true,
          message: 'Lead created successfully',
          severity: 'success'
        });
      } else if (formMode === 'edit' && currentLead) {
        // Update existing lead
        const response = await leadsAPI.updateLead(currentLead.id, leadData);
        console.log('Update lead response:', response.data);
        
        // Refresh leads list
        await fetchLeads();
        
        setSnackbar({
          open: true,
          message: 'Lead updated successfully',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving lead:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save lead',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Delete lead via API
      await leadsAPI.deleteLead(id);
      
      // Refresh leads list
      await fetchLeads();
      
      setSnackbar({
        open: true,
        message: 'Lead deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete lead',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'primary';
      case 'Contacted':
        return 'info';
      case 'Qualified':
        return 'success';
      case 'Unqualified':
        return 'error';
      case 'Converted':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
        
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Leads
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
        >
          New Lead
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.length > 0 ? (
                leads
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>{`${lead.first_name} ${lead.last_name}`}</TableCell>
                      <TableCell>{lead.company_name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.lead_source?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={lead.status?.name || 'N/A'} 
                          color={getStatusColor(lead.status?.name) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{lead.lead_score}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog('view', lead)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog('edit', lead)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(lead.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No leads found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={leads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Lead Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        disableEscapeKeyDown={submitting}
      >
        <DialogTitle>
          {formMode === 'create' ? 'Create Lead' : 
           formMode === 'edit' ? 'Edit Lead' : 'View Lead'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="first_name"
                label="First Name"
                fullWidth
                value={formData.first_name}
                onChange={handleInputChange}
                disabled={formMode === 'view' || submitting}
                required
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="last_name"
                label="Last Name"
                fullWidth
                value={formData.last_name}
                onChange={handleInputChange}
                disabled={formMode === 'view' || submitting}
                required
                error={!!formErrors.last_name}
                helperText={formErrors.last_name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="company_name"
                label="Company"
                fullWidth
                value={formData.company_name}
                onChange={handleInputChange}
                disabled={formMode === 'view' || submitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                value={formData.title}
                onChange={handleInputChange}
                disabled={formMode === 'view' || submitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                disabled={formMode === 'view' || submitting}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange}
                disabled={formMode === 'view' || submitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                disabled={formMode === 'view' || submitting}
                error={!!formErrors.lead_source}
              >
                <InputLabel>Lead Source</InputLabel>
                <Select
                  name="lead_source"
                  value={formData.lead_source}
                  label="Lead Source"
                  onChange={handleSelectChange}
                  required
                >
                  {leadSources.map((source) => (
                    <MenuItem key={source.id} value={source.id}>
                      {source.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.lead_source && (
                  <Typography variant="caption" color="error">
                    {formErrors.lead_source}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                disabled={formMode === 'view' || submitting}
                error={!!formErrors.status}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleSelectChange}
                  required
                >
                  {leadStatuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.status && (
                  <Typography variant="caption" color="error">
                    {formErrors.status}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="lead_score"
                label="Lead Score"
                type="number"
                fullWidth
                value={formData.lead_score}
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
                formMode === 'create' ? 'Create Lead' : 'Save Changes'
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

export default Leads;
