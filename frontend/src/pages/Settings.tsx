import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
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
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    height: '100%',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)',
    },
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#2A2D7C',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#2A2D7C',
      },
    },
  },
  button: {
    backgroundColor: '#2A2D7C',
    borderRadius: '8px',
    padding: '8px 16px',
    textTransform: 'none',
    fontWeight: 500,
    marginTop: '8px',
    '&:hover': {
      backgroundColor: '#373AA9',
    },
  },
  alert: {
    marginBottom: '24px',
    borderRadius: '8px',
  },
} as const;

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

export default function Settings(): JSX.Element {
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
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h1" sx={styles.title}>
          Settings
        </Typography>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={styles.alert}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={styles.alert}>
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={styles.settingsCard}>
            <CardContent>
              <Typography sx={styles.cardTitle}>
                Profile Settings
              </Typography>
              <Box component="form" onSubmit={handleProfileSubmit(onProfileSubmit)} sx={styles.form}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...registerProfile('first_name')}
                  error={!!profileErrors.first_name}
                  helperText={profileErrors.first_name?.message}
                  sx={styles.textField}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  {...registerProfile('last_name')}
                  error={!!profileErrors.last_name}
                  helperText={profileErrors.last_name?.message}
                  sx={styles.textField}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...registerProfile('email')}
                  error={!!profileErrors.email}
                  helperText={profileErrors.email?.message}
                  sx={styles.textField}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={styles.button}
                  disabled={updateProfileMutation.isPending}
                >
                  Update Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Password Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={styles.settingsCard}>
            <CardContent>
              <Typography sx={styles.cardTitle}>
                Change Password
              </Typography>
              <Box component="form" onSubmit={handlePasswordSubmit(onPasswordSubmit)} sx={styles.form}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  {...registerPassword('current_password')}
                  error={!!passwordErrors.current_password}
                  helperText={passwordErrors.current_password?.message}
                  sx={styles.textField}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  {...registerPassword('new_password')}
                  error={!!passwordErrors.new_password}
                  helperText={passwordErrors.new_password?.message}
                  sx={styles.textField}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  {...registerPassword('confirm_password')}
                  error={!!passwordErrors.confirm_password}
                  helperText={passwordErrors.confirm_password?.message}
                  sx={styles.textField}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={styles.button}
                  disabled={passwordMutation.isPending}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 