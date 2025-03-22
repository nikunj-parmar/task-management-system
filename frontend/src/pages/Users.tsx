import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as UserIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { User } from '../types';

const styles = {
  container: {
    padding: '16px',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#2A2D7C',
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)',
    },
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  userIcon: {
    color: '#2A2D7C',
    marginRight: '12px',
    fontSize: '24px',
  },
  userName: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#2A2D7C',
  },
  userEmail: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: '8px',
  },
  username: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: '16px',
  },
  roleChip: {
    borderRadius: '4px',
    height: '24px',
    fontSize: '12px',
    fontWeight: 500,
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  },
  iconButton: {
    padding: '4px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  editButton: {
    color: '#2A2D7C',
  },
  deleteButton: {
    color: '#d32f2f',
  },
  addButton: {
    backgroundColor: '#2A2D7C',
    borderRadius: '8px',
    padding: '8px 16px',
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#373AA9',
    },
  },
  dialogContent: {
    paddingTop: '16px',
  },
  textField: {
    marginBottom: '16px',
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#2A2D7C',
      },
    },
  },
  dialogActions: {
    padding: '16px 24px',
  },
} as const;

const roleColors = {
  admin: 'error',
  manager: 'warning',
  user: 'info',
} as const;

export default function Users(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => userAPI.getUsers().then((res) => res.data),
  });

  const createUserMutation = useMutation({
    mutationFn: (data: Partial<User>) => userAPI.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      userAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => userAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleOpen = (user?: User) => {
    setSelectedUser(user || null);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      role: formData.get('role') as User['role'],
    };

    if (selectedUser) {
      updateUserMutation.mutate({ id: selectedUser.id, data });
    } else {
      createUserMutation.mutate(data);
    }
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h1" sx={styles.title}>
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={styles.addButton}
        >
          Add User
        </Button>
      </Box>

      <Grid container spacing={3}>
        {users?.map((user: User) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card sx={styles.userCard}>
              <CardContent>
                <Box sx={styles.userInfo}>
                  <UserIcon sx={styles.userIcon} />
                  <Typography sx={styles.userName}>
                    {user.first_name} {user.last_name}
                  </Typography>
                </Box>
                <Typography sx={styles.userEmail}>
                  {user.email}
                </Typography>
                <Typography sx={styles.username}>
                  @{user.username}
                </Typography>
                <Chip
                  label={user.role.toLowerCase()}
                  color={roleColors[user.role as keyof typeof roleColors]}
                  size="small"
                  sx={styles.roleChip}
                />
                <Box sx={styles.actions}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(user)}
                    sx={{ ...styles.iconButton, ...styles.editButton }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteUserMutation.mutate(user.id)}
                    sx={{ ...styles.iconButton, ...styles.deleteButton }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: '20px', fontWeight: 600, color: '#2A2D7C' }}>
          {selectedUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={styles.dialogContent}>
            <TextField
              autoFocus
              name="username"
              label="Username"
              type="text"
              fullWidth
              defaultValue={selectedUser?.username}
              required
              sx={styles.textField}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              defaultValue={selectedUser?.email}
              required
              sx={styles.textField}
            />
            <TextField
              name="first_name"
              label="First Name"
              type="text"
              fullWidth
              defaultValue={selectedUser?.first_name}
              required
              sx={styles.textField}
            />
            <TextField
              name="last_name"
              label="Last Name"
              type="text"
              fullWidth
              defaultValue={selectedUser?.last_name}
              required
              sx={styles.textField}
            />
            <TextField
              name="role"
              label="Role"
              select
              fullWidth
              defaultValue={selectedUser?.role || 'user'}
              sx={styles.textField}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button
              onClick={handleClose}
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
              sx={styles.addButton}
            >
              {selectedUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 