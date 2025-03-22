import { Close as CloseIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Drawer,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Task, TaskPriority, TaskStatus } from '../../types/task';

interface TaskDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => void;
  task?: Task;
  isEditing?: boolean;
}

export default function TaskDrawer({
  open,
  onClose,
  onSubmit,
  task,
  isEditing = false,
}: TaskDrawerProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Partial<Task>>({
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedTo: user?.id,
    },
  });

  useEffect(() => {
    if (task) {
      Object.entries(task).forEach(([key, value]) => {
        setValue(key as keyof Task, value);
      });
    } else {
      reset();
    }
  }, [task, setValue, reset]);

  const handleFormSubmit = async (data: Partial<Task>) => {
    try {
      setLoading(true);
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500 },
          background: '#ffffff',
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(handleFormSubmit)} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Stack spacing={3}>
            <TextField
              label="Title"
              fullWidth
              {...register('title', { required: 'Title is required' })}
              error={!!errors.title}
              helperText={errors.title?.message as string}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              {...register('description')}
            />

            <TextField
              label="Due Date"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('dueDate', { required: 'Due date is required' })}
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message as string}
            />

            <FormControl fullWidth error={!!errors.priority}>
              <InputLabel>Priority</InputLabel>
              <Select
                label="Priority"
                {...register('priority')}
                defaultValue={TaskPriority.MEDIUM}
              >
                <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
                <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
                <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
              </Select>
              {errors.priority && (
                <FormHelperText>{errors.priority.message as string}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                {...register('status')}
                defaultValue={TaskStatus.TODO}
              >
                <MenuItem value={TaskStatus.TODO}>To Do</MenuItem>
                <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
                <MenuItem value={TaskStatus.DONE}>Done</MenuItem>
              </Select>
              {errors.status && (
                <FormHelperText>{errors.status.message as string}</FormHelperText>
              )}
            </FormControl>
          </Stack>

          <Box sx={{ mt: 'auto', pt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth
              sx={{
                borderColor: 'rgba(0, 0, 0, 0.12)',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'rgba(0, 0, 0, 0.24)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
                },
              }}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
} 