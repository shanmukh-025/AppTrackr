import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ColorModeContext } from '../App';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArticleIcon from '@mui/icons-material/Article';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: 16,
  left: 16,
  zIndex: theme.zIndex.drawer + 2,
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
  color: '#fff',
}));

const UserSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'light' ? '#f8f9fa' : theme.palette.background.default,
  margin: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
  '&.active .MuiListItemButton-root': {
    backgroundColor: theme.palette.mode === 'light'
      ? 'rgba(99, 102, 241, 0.1)'
      : 'rgba(99, 102, 241, 0.2)',
    color: theme.palette.primary.main,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
}));

function Sidebar() {
  const { user: authUser, logout } = useContext(AuthContext);
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { path: '/applications', icon: <DescriptionIcon />, label: 'Applications' },
    { path: '/jobs', icon: <WorkIcon />, label: 'Jobs' },
    { path: '/ai-features', icon: <SmartToyIcon />, label: 'AI Assistant' },
    { path: '/project-builder', icon: <SmartToyIcon />, label: '🛠️ Project Builder' },
    { path: '/analytics', icon: <BarChartIcon />, label: 'Analytics' },
    { path: '/profile', icon: <PersonIcon />, label: 'Profile' },
    { path: '/resources', icon: <MenuBookIcon />, label: 'Resources' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <LogoSection>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
        >
          🎯
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>
          AppTrackr
        </Typography>
        <IconButton
          onClick={closeMobileMenu}
          sx={{
            color: '#fff',
            display: { md: 'none' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </LogoSection>

      {/* User Info */}
      <UserSection>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: theme.palette.primary.main,
            fontSize: '20px',
          }}
          src={authUser?.profilePicture}
        >
          {(authUser?.name || authUser?.email || '').charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {authUser?.name || 'User'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {authUser?.email}
          </Typography>
        </Box>
      </UserSection>

      <Divider />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ px: 1 }}>
            <StyledNavLink to={item.path} onClick={closeMobileMenu}>
              <ListItemButton
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? 'rgba(99, 102, 241, 0.05)'
                      : 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </StyledNavLink>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Footer - Theme Toggle & Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={colorMode.toggleColorMode}
          sx={{
            borderRadius: 1,
            mb: 1,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light'
                ? 'rgba(99, 102, 241, 0.05)'
                : 'rgba(99, 102, 241, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText
            primary={theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            primaryTypographyProps={{
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          />
        </ListItemButton>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 1,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <MobileMenuButton onClick={toggleMobileMenu} size="large">
        <MenuIcon />
      </MobileMenuButton>

      {/* Desktop Drawer - Permanent */}
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
        }}
      >
        {drawerContent}
      </StyledDrawer>

      {/* Mobile Drawer - Temporary */}
      <StyledDrawer
        variant="temporary"
        open={isMobileMenuOpen}
        onClose={closeMobileMenu}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {drawerContent}
      </StyledDrawer>
    </>
  );
}

export default Sidebar;
