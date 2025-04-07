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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessIcon from '@mui/icons-material/Business';

const Contacts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentContact, setCurrentContact] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');

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

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // For now, we'll simulate loading and set some dummy data
    const timer = setTimeout(() => {
      const dummyContacts = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        first_name: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily'][i % 6],
        last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller'][i % 6],
        account: {
          id: Math.floor(i / 3) + 1,
          account_name: `Account ${Math.floor(i / 3) + 1}`
        },
        title: ['CEO', 'CTO', 'CFO', 'Marketing Director', 'Sales Manager', 'IT Manager'][i % 6],
        email: `contact${i + 1}@example.com`,
        phone: `(555) ${100 + i}-${1000 + i}`,
        mobile: `(555) ${200 + i}-${2000 + i}`,
        is_primary: i % 5 === 0,
        is_decision_maker: i % 3 === 0,
        created_at: new Date(Date.now() - i * 86400000).toISOString()
      }));
      
      setContacts(dummyContacts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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
        account: contact.account.account_name,
        title: contact.title || '',
        email: contact.email || '',
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        is_primary: contact.is_primary,
        is_decision_maker: contact.is_decision_maker
      });
    } else {
      setCurrentContact(null);
      setFormData({
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

  const handleSubmit = () => {
    // In a real implementation, this would send data to the API
    if (formMode === 'create') {
      const newContact = {
        id: contacts.length + 1,
        ...formData,
        account: {
          id: 1,
          account_name: formData.account
        },
        created_at: new Date().toISOString()
      };
      setContacts([newContact, ...contacts]);
    } else if (formMode === 'edit' && currentContact) {
      const updatedContacts = contacts.map(contact => 
        contact.id === currentContact.id ? { 
          ...contact, 
          ...formData,
          account: {
            id: contact.account.id,
            account_name: formData.account
          }
        } : contact
      );
      setContacts(updatedContacts);
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    // In a real implementation, this would send a delete request to the API
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
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
              {contacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{`${contact.first_name} ${contact.last_name}`}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        {contact.account.account_name}
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
                ))}
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
              <TextField
                name="account"
                label="Account"
                fullWidth
                value={formData.account}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
                required
              />
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {formMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {formMode !== 'view' && (
            <Button onClick={handleSubmit} variant="contained">
              {formMode === 'create' ? 'Create' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Contacts;
