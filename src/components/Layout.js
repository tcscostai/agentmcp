import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Science as ScienceIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 64,
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  padding: '0 16px',
  color: theme.palette.text.secondary,
  minWidth: 'auto',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
  },
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0',
  },
  minHeight: 64,
  flex: 'none',
}));

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: 64,
  background: '#F8FAFF',
  minHeight: 'calc(100vh - 64px)',
}));

const LogoContainer = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& img': {
    width: 40,
    height: 40,
  },
  '& .logo-text': {
    fontSize: '1.2rem',
    fontWeight: 600,
    background: 'linear-gradient(45deg, #0066FF 30%, #00C6FF 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '0.5px',
  }
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Design Agent', icon: <ScienceIcon />, path: '/design-agent' },
  { text: 'Design SLM Agent', icon: <PsychologyIcon />, path: '/design-slm-agent' },
  { text: 'Analyse Agents', icon: <AnalyticsIcon />, path: '/analyse-agents' },
  { text: 'Configuration', icon: <SettingsIcon />, path: '/configuration' },
];

function Layout({ onLogout }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('isAuthenticated');
    if (onLogout) {
      onLogout();
    }
    handleMenuClose();
    navigate('/login');
  };

  const handleTabChange = (event, newValue) => {
    const path = menuItems[newValue].path;
    navigate(path);
  };

  const currentTab = menuItems.findIndex(item => item.path === location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="fixed">
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          px: { xs: 2, sm: 4 },
          gap: 2,
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            minWidth: 'auto'
          }}>
            <LogoContainer
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src="/logo.svg"
                alt="AegenticMed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.span 
                className="logo-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                AgenticMed
              </motion.span>
            </LogoContainer>
          </Box>

          <StyledTabs 
            value={currentTab !== -1 ? currentTab : 0}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ mx: 2 }}
          >
            {menuItems.map((item) => (
              <StyledTab
                key={item.path}
                icon={item.icon}
                iconPosition="start"
                label={item.text}
              />
            ))}
          </StyledTabs>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            minWidth: 'auto'
          }}>
            <IconButton onClick={handleMenuClick}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <PersonIcon />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  minWidth: 180,
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ 
                    color: 'error' 
                  }} 
                />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </StyledAppBar>

      <Main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Main>
    </Box>
  );
}

export default Layout; 