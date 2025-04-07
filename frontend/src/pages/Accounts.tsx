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
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Accounts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');

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

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // For now, we'll simulate loading and set some dummy data
    const timer = setTimeout(() => {
      const dummyAccounts = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        account_name: `Account ${i + 1}`,
        account_number: `ACC-${1000 + i}`,
        industry: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail'][i % 5],
        website: `https://example${i + 1}.com`,
        phone: `(555) ${100 + i}-${1000 + i}`,
        status: ['Active', 'Inactive'][i % 2],
        created_at: new Date(Date.now() - i * 86400000).toISOString()
      }));
      
      setAccounts(dummyAccounts);
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

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', account?: any) => {
    setFormMode(mode);
    if (account) {
      setCurrentAccount(account);
      setFormData({
        account_name: account.account_name,
        account_number: account.account_number,
        industry: account.industry,
        website: account.website || '',
        phone: account.phone || '',
        description: '',
        status: account.status
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
      const newAccount = {
        id: accounts.length + 1,
        ...formData,
        created_at: new Date().toISOString()
      };
      setAccounts([newAccount, ...accounts]);
    } else if (formMode === 'edit' && currentAccount) {
      const updatedAccounts = accounts.map(account => 
        account.id === currentAccount.id ? { ...account, ...formData } : account
      );
      setAccounts(updatedAccounts);
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    // In a real implementation, this would send a delete request to the API
    const updatedAccounts = accounts.filter(account => account.id !== id);
    setAccounts(updatedAccounts);
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
              {accounts
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
                ))}
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
                name="status"
                label="Status"
                fullWidth
                value={formData.status}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
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

export default Accounts;
