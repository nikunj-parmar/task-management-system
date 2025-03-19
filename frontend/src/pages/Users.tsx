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
    CardActions,
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
import { userAPI } from '../services/api';
import { User } from '../types';

const roleColors = {
  admin: 'error',
  manager: 'warning',
  user: 'info',
} as const;

export default function Users() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

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

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New User
        </Button>
      </Box>

      <Grid container spacing={3}>
        {users?.map((user: User) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <UserIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    {user.first_name} {user.last_name}
                  </Typography>
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  @{user.username}
                </Typography>
                <Chip
                  label={user.role}
                  color={roleColors[user.role as keyof typeof roleColors]}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpen(user)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => deleteUserMutation.mutate(user.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="username"
              label="Username"
              type="text"
              fullWidth
              defaultValue={selectedUser?.username}
              required
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              defaultValue={selectedUser?.email}
              required
            />
            <TextField
              margin="dense"
              name="first_name"
              label="First Name"
              type="text"
              fullWidth
              defaultValue={selectedUser?.first_name}
              required
            />
            <TextField
              margin="dense"
              name="last_name"
              label="Last Name"
              type="text"
              fullWidth
              defaultValue={selectedUser?.last_name}
              required
            />
            <TextField
              margin="dense"
              name="role"
              label="Role"
              select
              fullWidth
              defaultValue={selectedUser?.role || 'user'}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
            >
              {selectedUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 