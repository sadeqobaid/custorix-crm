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
  Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Leads: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentLead, setCurrentLead] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');

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

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // For now, we'll simulate loading and set some dummy data
    const timer = setTimeout(() => {
      const leadSources = ['Website', 'Referral', 'Trade Show', 'Social Media', 'Email Campaign'];
      const statuses = ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'];
      
      const dummyLeads = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        first_name: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily'][i % 6],
        last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller'][i % 6],
        company_name: `Company ${i + 1}`,
        title: ['CEO', 'CTO', 'CFO', 'Marketing Director', 'Sales Manager', 'IT Manager'][i % 6],
        email: `lead${i + 1}@example.com`,
        phone: `(555) ${100 + i}-${1000 + i}`,
        lead_source: {
          id: (i % 5) + 1,
          name: leadSources[i % 5]
        },
        status: {
          id: (i % 5) + 1,
          name: statuses[i % 5]
        },
        lead_score: Math.floor(Math.random() * 100),
        created_at: new Date(Date.now() - i * 86400000).toISOString()
      }));
      
      setLeads(dummyLeads);
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

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', lead?: any) => {
    setFormMode(mode);
    if (lead) {
      setCurrentLead(lead);
      setFormData({
        first_name: lead.first_name,
        last_name: lead.last_name,
        company_name: lead.company_name || '',
        title: lead.title || '',
        email: lead.email || '',
        phone: lead.phone || '',
        lead_source: lead.lead_source.name,
        status: lead.status.name,
        description: '',
        lead_score: lead.lead_score
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
        lead_source: '',
        status: 'New',
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
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // In a real implementation, this would send data to the API
    if (formMode === 'create') {
      const newLead = {
        id: leads.length + 1,
        ...formData,
        lead_source: {
          id: 1,
          name: formData.lead_source
        },
        status: {
          id: 1,
          name: formData.status
        },
        created_at: new Date().toISOString()
      };
      setLeads([newLead, ...leads]);
    } else if (formMode === 'edit' && currentLead) {
      const updatedLeads = leads.map(lead => 
        lead.id === currentLead.id ? { 
          ...lead, 
          ...formData,
          lead_source: {
            id: lead.lead_source.id,
            name: formData.lead_source
          },
          status: {
            id: lead.status.id,
            name: formData.status
          }
        } : lead
      );
      setLeads(updatedLeads);
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    // In a real implementation, this would send a delete request to the API
    const updatedLeads = leads.filter(lead => lead.id !== id);
    setLeads(updatedLeads);
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
              {leads
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{`${lead.first_name} ${lead.last_name}`}</TableCell>
                    <TableCell>{lead.company_name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.lead_source.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={lead.status.name} 
                        color={getStatusColor(lead.status.name) as any}
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
                ))}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
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
                name="company_name"
                label="Company"
                fullWidth
                value={formData.company_name}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
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
              <FormControl fullWidth disabled={formMode === 'view'}>
                <InputLabel>Lead Source</InputLabel>
                <Select
                  name="lead_source"
                  value={formData.lead_source}
                  label="Lead Source"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Website">Website</MenuItem>
                  <MenuItem value="Referral">Referral</MenuItem>
                  <MenuItem value="Trade Show">Trade Show</MenuItem>
                  <MenuItem value="Social Media">Social Media</MenuItem>
                  <MenuItem value="Email Campaign">Email Campaign</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={formMode === 'view'}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Contacted">Contacted</MenuItem>
                  <MenuItem value="Qualified">Qualified</MenuItem>
                  <MenuItem value="Unqualified">Unqualified</MenuItem>
                  <MenuItem value="Converted">Converted</MenuItem>
                </Select>
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

export default Leads;
