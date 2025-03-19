import { zodResolver } from '@hookform/resolvers/zod';
import {
    Alert,
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../services/api';
import { User } from '../types';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
  current_password: z.string().min(6, 'Current password is required'),
  new_password: z.string().min(6, 'New password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: userData } = useQuery<User>({
    queryKey: ['user', user?.id],
    queryFn: () => userAPI.getCurrentUser().then((res) => res.data),
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) =>
      userAPI.updateUser(user?.id || 0, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      setSuccessMessage('Profile updated successfully');
      setErrorMessage(null);
    },
    onError: () => {
      setErrorMessage('Failed to update profile');
      setSuccessMessage(null);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordFormData) =>
      userAPI.updatePassword(data.current_password, data.new_password),
    onSuccess: () => {
      setSuccessMessage('Password updated successfully');
      setErrorMessage(null);
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.detail || 'Failed to update password');
    },
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      email: userData?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    passwordMutation.mutate(data);
    resetPassword();
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Settings
            </Typography>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <TextField
                margin="normal"
                fullWidth
                label="First Name"
                {...registerProfile('first_name')}
                error={!!profileErrors.first_name}
                helperText={profileErrors.first_name?.message}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Last Name"
                {...registerProfile('last_name')}
                error={!!profileErrors.last_name}
                helperText={profileErrors.last_name?.message}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                type="email"
                {...registerProfile('email')}
                error={!!profileErrors.email}
                helperText={profileErrors.email?.message}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={updateProfileMutation.isPending}
              >
                Update Profile
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Password Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <TextField
                margin="normal"
                fullWidth
                label="Current Password"
                type="password"
                {...registerPassword('current_password')}
                error={!!passwordErrors.current_password}
                helperText={passwordErrors.current_password?.message}
              />
              <TextField
                margin="normal"
                fullWidth
                label="New Password"
                type="password"
                {...registerPassword('new_password')}
                error={!!passwordErrors.new_password}
                helperText={passwordErrors.new_password?.message}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Confirm New Password"
                type="password"
                {...registerPassword('confirm_password')}
                error={!!passwordErrors.confirm_password}
                helperText={passwordErrors.confirm_password?.message}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={passwordMutation.isPending}
              >
                Change Password
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 