import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const styles = {
  sidebar: {
    background: '#2A2D7C',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    width: '240px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px 16px',
    marginBottom: '10px',
  },
  logoBox: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 28,
    color: '#fff',
  },
  menuSection: {
    padding: '8px 0',
  },
  menuTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.75rem',
    fontWeight: 500,
    padding: '0 20px',
    marginBottom: '4px',
  },
  menuItem: {
    padding: '8px 16px',
    margin: '2px 8px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  menuIcon: {
    color: 'rgba(255, 255, 255, 0.7)',
    minWidth: 35,
    '& .MuiSvgIcon-root': {
      fontSize: '1.3rem',
    },
  },
  menuText: {
    '& .MuiTypography-root': {
      fontSize: '0.9rem',
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: 400,
    },
  },
  activeMenuItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    '& .MuiListItemIcon-root': {
      color: '#fff',
    },
    '& .MuiTypography-root': {
      color: '#fff',
      fontWeight: 500,
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
  },
  logoutSection: {
    marginTop: 'auto',
    padding: '16px',
  },
  logoutButton: {
    color: '#ff4d4f',
    padding: '8px 16px',
    margin: '2px 8px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'rgba(255, 77, 79, 0.08)',
    },
    '& .MuiListItemIcon-root': {
      color: '#ff4d4f',
      minWidth: 35,
    },
    '& .MuiTypography-root': {
      color: '#ff4d4f',
      fontSize: '0.9rem',
    },
  },
} as const;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function Sidebar(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Box sx={styles.sidebar}>
      <Box sx={styles.logoContainer}>
        <Box sx={styles.logoBox}>
          <TaskIcon sx={styles.logoIcon} />
        </Box>
      </Box>

      <Box sx={styles.menuSection}>
        <Typography sx={styles.menuTitle}>MAIN MENU</Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                ...styles.menuItem,
                ...(location.pathname === item.path && styles.activeMenuItem),
              }}
            >
              <ListItemIcon sx={styles.menuIcon}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={styles.menuText} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={styles.logoutSection}>
        <Typography sx={styles.menuTitle}>ACCOUNT</Typography>
        <List>
          <ListItem
            button
            onClick={logout}
            sx={styles.logoutButton}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
} 