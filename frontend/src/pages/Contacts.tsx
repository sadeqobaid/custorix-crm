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
  FormControlLabel,
  Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessIcon from '@mui/icons-material/Business';
import { contactsAPI, accountsAPI } from '../api/apiService';

const Contacts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentContact, setCurrentContact] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    account: '',
    title: '',
    email: '',
    phone: '',
    mobile: '',
    is_primary: false,
    is_decision_maker: false
  });

  // Fetch contacts and accounts from API
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await contactsAPI.getContacts();
      console.log('Fetched contacts:', response.data);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load contacts',
        severity: 'error'
      });
      // Use dummy data as fallback
      const dummyContacts = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        first_name: ['John', 'Jane', 'Michael', 'Sarah', 'David'][i],
        last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i],
        account: {
          id: i + 1,
          account_name: `Account ${i + 1}`
        },
        title: ['CEO', 'CTO', 'CFO', 'Marketing Director', 'Sales Manager'][i],
        email: `contact${i + 1}@example.com`,
        phone: `(555) ${100 + i}-${1000 + i}`,
        is_primary: i % 2 === 0,
        is_decision_maker: i % 3 === 0,
        created_at: new Date().toISOString()
      }));
      setContacts(dummyContacts);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAccounts();
      console.log('Fetched accounts:', response.data);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      // Use dummy accounts as fallback
      const dummyAccounts = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        account_name: `Account ${i + 1}`
      }));
      setAccounts(dummyAccounts);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchAccounts();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', contact?: any) => {
    setFormMode(mode);
    if (contact) {
      setCurrentContact(contact);
      setFormData({
        first_name: contact.first_name,
        last_name: contact.last_name,
        account: contact.account.id,
        title: contact.title || '',
        email: contact.email || '',
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        is_primary: contact.is_primary || false,
        is_decision_maker: contact.is_decision_maker || false
      });
    } else {
      setCurrentContact(null);
      setFormData({
        first_name: '',
        last_name: '',
        account: accounts.length > 0 ? accounts[0].id : '',
        title: '',
        email: '',
        phone: '',
        mobile: '',
        is_primary: false,
        is_decision_maker: false
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
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleSubmit = async () => {
    try {
      // Prepare data for API
      const contactData = {
        ...formData
      };
      
      console.log('Submitting contact data:', contactData);
      
      if (formMode === 'create') {
        // Create new contact
        const response = await contactsAPI.createContact(contactData);
        console.log('Create contact response:', response.data);
        
        // Refresh contacts list
        await fetchContacts();
        
        setSnackbar({
          open: true,
          message: 'Contact created successfully',
          severity: 'success'
        });
      } else if (formMode === 'edit' && currentContact) {
        // Update existing contact
        const response = await contactsAPI.updateContact(currentContact.id, contactData);
        console.log('Update contact response:', response.data);
        
        // Refresh contacts list
        await fetchContacts();
        
        setSnackbar({
          open: true,
          message: 'Contact updated successfully',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving contact:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save contact',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Delete contact via API
      await contactsAPI.deleteContact(id);
      
      // Refresh contacts list
      await fetchContacts();
      
      setSnackbar({
        open: true,
        message: 'Contact deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete contact',
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
          Contacts
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
        >
          New Contact
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.length > 0 ? (
                contacts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>{`${contact.first_name} ${contact.last_name}`}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                          {contact.account?.account_name || 'N/A'}
                        </Box>
                      </TableCell>
                      <TableCell>{contact.title}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>
                        {contact.is_primary && (
                          <Chip size="small" label="Primary" color="primary" sx={{ mr: 1 }} />
                        )}
                        {contact.is_decision_maker && (
                          <Chip size="small" label="Decision Maker" color="secondary" />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog('view', contact)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog('edit', contact)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(contact.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No contacts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={contacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Contact Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {formMode === 'create' ? 'Create Contact' : 
           formMode === 'edit' ? 'Edit Contact' : 'View Contact'}
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
                disabled={formMode === 'view'}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="last_name"
                label="Last Name"
                fullWidth
                value={formData.last_name}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="account-label">Account</InputLabel>
                <Select
                  labelId="account-label"
                  name="account"
                  value={formData.account}
                  onChange={handleSelectChange}
                  disabled={formMode === 'view'}
                  label="Account"
                  required
                >
                  {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.account_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                value={formData.title}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="mobile"
                label="Mobile"
                fullWidth
                value={formData.mobile}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_primary"
                    checked={formData.is_primary}
                    onChange={handleCheckboxChange}
                    disabled={formMode === 'view'}
                  />
                }
                label="Primary Contact"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_decision_maker"
                    checked={formData.is_decision_maker}
                    onChange={handleCheckboxChange}
                    disabled={formMode === 'view'}
                  />
                }
                label="Decision Maker"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {formMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {formMode !== 'view' && (
            <Button onClick={handleSubmit} variant="contained">
              {formMode === 'create' ? 'Create Contact' : 'Save Changes'}
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

export default Contacts;
