import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { styled, alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Book as BookIcon,
  School as SchoolIcon,
  Flag as ReportIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { authService } from '../../services/api';
import '../styles/MainLayout.css';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const CustomListButton = styled(ListItemButton)(({ theme, isactive }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  ...(isactive === 'true' && {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.16),
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiTypography-root': {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
  }),
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(1),
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    '& .MuiMenu-list': {
      padding: theme.spacing(1, 0),
    },
    '& .MuiMenuItem-root': {
      padding: theme.spacing(1, 2),
      margin: theme.spacing(0.5, 1),
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
      },
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        marginRight: theme.spacing(1.5),
      },
    },
  },
}));

function MainLayout() {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const theme = useTheme();
  const location = useLocation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // Notification data - in a real app, this would come from an API
  const notifications = [
    { id: 1, message: "New user registered", read: false, time: "10 min ago" },
    { id: 2, message: "System update completed", read: true, time: "1 hour ago" },
    { id: 3, message: "New content report submitted", read: false, time: "3 hours ago" },
    { id: 4, message: "Database backup completed", read: true, time: "Yesterday" },
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Check authentication on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/admin/login');
      return;
    }
    
    setCurrentUser(user);
    
    // Close drawer on mobile by default
    if (isSmallScreen) {
      setOpen(false);
    }
  }, [navigate, isSmallScreen]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    
    // Close drawer on navigation if on mobile
    if (isSmallScreen) {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  // Check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Menu items configuration
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin',
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/admin/users',
    },
    {
      text: 'Flashcard Set',
      icon: <BookIcon />,
      path: '/admin/FlashcardSet',
    },
    {
      text: 'Multiple Choice Test',
      icon: <SchoolIcon />,
      path: '/admin/multiplechoice',
    },
    {
      text: 'Content Reports',
      icon: <ReportIcon />,
      path: '/admin/reports',
    },
  ];

  return (
    <Box className="main-layout-container">
      <AppBarStyled position="fixed" open={open} className="app-bar">
        <Toolbar className="toolbar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            WordWise Admin
          </Typography>
          <Box className="app-bar-controls">
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationOpen}
                className="notification-badge"
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar 
                  alt={currentUser?.name || "User"} 
                  src={currentUser?.avatarUrl}
                  className="user-avatar"
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBarStyled>
      
      <Menu
        anchorEl={notificationEl}
        open={Boolean(notificationEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          className: "notification-menu"
        }}
      >
        <Box className="notification-header">
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
          <Typography variant="caption" color="primary">
            Mark all as read
          </Typography>
        </Box>
        <Divider />
        {notifications.map((notification) => (
          <MenuItem 
            key={notification.id} 
            onClick={handleNotificationClose}
            className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2">
                {notification.message}
              </Typography>
              <Typography variant="caption" className="notification-time">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            mt: 1.5,
            minWidth: 200,
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {currentUser?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentUser?.email || 'user@example.com'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleClose} className="user-menu-item">
          <AccountCircle className="user-menu-icon" />
          My Profile
        </MenuItem>
        <MenuItem onClick={handleClose} className="user-menu-item">
          <SettingsIcon className="user-menu-icon" />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} className="user-menu-item">
          <LogoutIcon className="user-menu-icon" />
          Logout
        </MenuItem>
      </Menu>
      
      <Drawer
        className="drawer"
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: "drawer-paper",
        }}
      >
        <Box className="drawer-header">
          <Box className="drawer-logo">
            <Typography className="drawer-logo-text">
              WORDWISE
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                className={`menu-item ${isActive(item.path) ? 'menu-item-active' : ''}`}
              >
                <ListItemIcon className="menu-item-icon">
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} className="menu-item-text" />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Main open={open} className="main-content">
        <Toolbar />
        <Box>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
}

export default MainLayout; 