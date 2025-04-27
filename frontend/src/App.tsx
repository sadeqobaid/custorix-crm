import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CampaignIcon from '@mui/icons-material/Campaign';
import SupportIcon from '@mui/icons-material/Support';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import { authAPI } from './api/apiService';

// Import all pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Accounts from './pages/Accounts';
import Contacts from './pages/Contacts';
import Leads from './pages/Leads';
import Opportunities from './pages/Opportunities';
import Campaigns from './pages/Campaigns';
import SupportTickets from './pages/SupportTickets';
import KnowledgeBase from './pages/KnowledgeBase';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ThankYou from './pages/ThankYou';

const drawerWidth = 240;

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = authAPI.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());

  // Check authentication status only once on component mount
  // This prevents infinite loops with the login page
  useEffect(() => {
    const authStatus = authAPI.isAuthenticated();
    setIsAuthenticated(authStatus);
    
    // Only redirect if not already on login, register, or thank-you page
    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';
    const isThankYouPage = location.pathname === '/thank-you';
    
    if (!authStatus && !isLoginPage && !isRegisterPage && !isThankYouPage) {
      navigate('/login');
    } else if (authStatus && isLoginPage) {
      navigate('/dashboard');
    }
  }, []);

  const handleLogout = () => {
    // Call the logout API function
    authAPI.logout();
    setIsAuthenticated(false);
    
    // Navigate to the thank you page
    navigate('/thank-you');
  };

  // Render different layouts based on authentication
  const renderAuthenticatedLayout = () => (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Custorix CRM
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/dashboard">
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/accounts">
              <ListItemIcon><BusinessIcon /></ListItemIcon>
              <ListItemText primary="Accounts" />
            </ListItem>
            <ListItem button component={Link} to="/contacts">
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Contacts" />
            </ListItem>
            <ListItem button component={Link} to="/leads">
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="Leads" />
            </ListItem>
            <ListItem button component={Link} to="/opportunities">
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="Opportunities" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button component={Link} to="/campaigns">
              <ListItemIcon><CampaignIcon /></ListItemIcon>
              <ListItemText primary="Campaigns" />
            </ListItem>
            <ListItem button component={Link} to="/support-tickets">
              <ListItemIcon><SupportIcon /></ListItemIcon>
              <ListItemText primary="Support Tickets" />
            </ListItem>
            <ListItem button component={Link} to="/knowledge-base">
              <ListItemIcon><SupportIcon /></ListItemIcon>
              <ListItemText primary="Knowledge Base" />
            </ListItem>
            <ListItem button component={Link} to="/invoices">
              <ListItemIcon><ReceiptIcon /></ListItemIcon>
              <ListItemText primary="Invoices" />
            </ListItem>
            <ListItem button component={Link} to="/reports">
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
            <ListItem button component={Link} to="/settings">
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon><InfoIcon /></ListItemIcon>
              <ListItemText 
                primary="Developed by: Sadeq Obaid" 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  style: { fontStyle: 'italic' }
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/support-tickets" element={<SupportTickets />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );

  const renderUnauthenticatedLayout = () => (
    <Container>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Container>
  );

  // Update authentication state when login is successful
  useEffect(() => {
    const handleLoginSuccess = () => {
      setIsAuthenticated(true);
    };
    
    window.addEventListener('login-success', handleLoginSuccess);
    
    return () => {
      window.removeEventListener('login-success', handleLoginSuccess);
    };
  }, []);

  return isAuthenticated ? renderAuthenticatedLayout() : renderUnauthenticatedLayout();
};

export default App;
