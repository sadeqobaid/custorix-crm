import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Box,
  CircularProgress,
  Divider
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SupportIcon from '@mui/icons-material/Support';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    accounts: 0,
    contacts: 0,
    leads: 0,
    opportunities: 0,
    tickets: 0,
    invoices: 0,
    recentLeads: [],
    recentOpportunities: [],
    recentTickets: []
  });

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // For now, we'll simulate loading and set some dummy data
    const timer = setTimeout(() => {
      setStats({
        accounts: 124,
        contacts: 356,
        leads: 78,
        opportunities: 42,
        tickets: 15,
        invoices: 63,
        recentLeads: [
          { id: 1, name: 'John Smith', company: 'Acme Inc.', status: 'New' },
          { id: 2, name: 'Sarah Johnson', company: 'XYZ Corp', status: 'Contacted' },
          { id: 3, name: 'Michael Brown', company: 'ABC Ltd', status: 'Qualified' }
        ],
        recentOpportunities: [
          { id: 1, name: 'Enterprise Solution', account: 'Acme Inc.', amount: 25000, stage: 'Proposal' },
          { id: 2, name: 'Software License', account: 'XYZ Corp', amount: 12000, stage: 'Negotiation' },
          { id: 3, name: 'Consulting Services', account: 'ABC Ltd', amount: 8500, stage: 'Closed Won' }
        ],
        recentTickets: [
          { id: 1, subject: 'Login Issue', priority: 'High', status: 'Open' },
          { id: 2, subject: 'Feature Request', priority: 'Medium', status: 'In Progress' },
          { id: 3, subject: 'Billing Question', priority: 'Low', status: 'Resolved' }
        ]
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5">{stats.accounts}</Typography>
                <Typography variant="body2" color="textSecondary">Accounts</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5">{stats.contacts}</Typography>
                <Typography variant="body2" color="textSecondary">Contacts</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonSearchIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5">{stats.leads}</Typography>
                <Typography variant="body2" color="textSecondary">Leads</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <MonetizationOnIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5">{stats.opportunities}</Typography>
                <Typography variant="body2" color="textSecondary">Opportunities</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <SupportIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5">{stats.tickets}</Typography>
                <Typography variant="body2" color="textSecondary">Support Tickets</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5">{stats.invoices}</Typography>
                <Typography variant="body2" color="textSecondary">Invoices</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Items */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Leads
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentLeads.map((lead: any) => (
              <Box key={lead.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{lead.name}</Typography>
                <Typography variant="body2" color="textSecondary">{lead.company}</Typography>
                <Typography variant="body2" color="primary">{lead.status}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Opportunities
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentOpportunities.map((opportunity: any) => (
              <Box key={opportunity.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{opportunity.name}</Typography>
                <Typography variant="body2" color="textSecondary">{opportunity.account}</Typography>
                <Typography variant="body2">${opportunity.amount.toLocaleString()}</Typography>
                <Typography variant="body2" color="primary">{opportunity.stage}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Support Tickets
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentTickets.map((ticket: any) => (
              <Box key={ticket.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{ticket.subject}</Typography>
                <Typography variant="body2" color="textSecondary">Priority: {ticket.priority}</Typography>
                <Typography variant="body2" color="primary">{ticket.status}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
