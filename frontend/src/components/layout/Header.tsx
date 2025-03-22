import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const styles = {
  appBar: {
    background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(26, 35, 126, 0.95)',
    height: '80px',
    zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
    width: '100%',
  },
  menuButton: {
    mr: 2,
    color: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'scale(1.05)',
      transition: 'all 0.2s ease-in-out',
    },
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    ml: 2,
    cursor: 'pointer',
    '&:hover': {
      '& .logo-icon': {
        transform: 'rotate(15deg)',
      },
    },
  },
  logoIcon: {
    fontSize: '2.5rem',
    color: '#ffffff',
    transition: 'transform 0.3s ease-in-out',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  logoText: {
    fontWeight: 800,
    fontSize: '1.8rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #e8eaf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    ml: 'auto',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '10px 20px',
    borderRadius: '30px',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    },
  },
  avatar: {
    width: 45,
    height: 45,
    background: 'linear-gradient(135deg, #5c6bc0 0%, #3949ab 100%)',
    color: '#ffffff',
    cursor: 'pointer',
    border: '2px solid rgba(255, 255, 255, 0.9)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      transform: 'scale(1.1)',
      transition: 'transform 0.2s ease-in-out',
    },
  },
  menu: {
    mt: 1.5,
    '& .MuiPaper-root': {
      borderRadius: '16px',
      minWidth: '240px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
        borderLeft: '1px solid rgba(0, 0, 0, 0.05)',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      },
    },
  },
  menuItem: {
    py: 1.5,
    px: 2,
    '&:hover': {
      backgroundColor: 'rgba(92, 107, 192, 0.04)',
    },
  },
  menuIcon: {
    color: '#5c6bc0',
    minWidth: 36,
  },
  menuText: {
    color: 'text.primary',
    fontWeight: 500,
  },
  divider: {
    my: 1,
    background: 'linear-gradient(90deg, transparent, rgba(92, 107, 192, 0.3), transparent)',
  },
} as const;

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps): JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    handleClose();
    navigate('/settings');
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <AppBar position="fixed" sx={styles.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={styles.menuButton}
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>

        <Box sx={styles.logoContainer} onClick={handleLogoClick}>
          <TaskIcon className="logo-icon" sx={styles.logoIcon} />
          <Typography sx={styles.logoText}>
            TaskFlow
          </Typography>
        </Box>

        <Box sx={styles.userContainer}>
          <Button
            onClick={handleMenu}
            sx={{
              color: 'rgba(255, 255, 255, 0.95)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#ffffff',
              },
            }}
          >
            {user?.first_name} {user?.last_name}
          </Button>
          <Avatar
            onClick={handleMenu}
            sx={styles.avatar}
          >
            {user?.first_name?.[0]?.toUpperCase() || <AccountCircleIcon />}
          </Avatar>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={styles.menu}
        >
          <MenuItem onClick={handleProfileClick} sx={styles.menuItem}>
            <ListItemIcon sx={styles.menuIcon}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" sx={styles.menuText} />
          </MenuItem>
          <MenuItem onClick={handleSettingsClick} sx={styles.menuItem}>
            <ListItemIcon sx={styles.menuIcon}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" sx={styles.menuText} />
          </MenuItem>
          <Divider sx={styles.divider} />
          <MenuItem onClick={handleLogout} sx={styles.menuItem}>
            <ListItemIcon sx={styles.menuIcon}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={styles.menuText} />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
} 