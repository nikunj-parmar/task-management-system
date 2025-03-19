import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Assignment as TaskIcon,
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
import { format } from 'date-fns';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { Task } from '../types';

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error',
} as const;

const statusColors = {
  todo: 'default',
  in_progress: 'primary',
  done: 'success',
} as const;

export default function Tasks() {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskAPI.getTasks().then((res) => res.data),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: Partial<Task>) => taskAPI.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setOpen(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) =>
      taskAPI.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setOpen(false);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => taskAPI.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleOpen = (task?: Task) => {
    setSelectedTask(task || null);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedTask(null);
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as Task['status'],
      priority: formData.get('priority') as Task['priority'],
      due_date: formData.get('due_date') as string,
    };

    if (selectedTask) {
      updateTaskMutation.mutate({ id: selectedTask.id, data });
    } else {
      createTaskMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tasks?.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TaskIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    {task.title}
                  </Typography>
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  {task.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={task.priority}
                    color={priorityColors[task.priority]}
                    size="small"
                  />
                  <Chip
                    label={task.status}
                    color={statusColors[task.status]}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpen(task)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => deleteTaskMutation.mutate(task.id)}
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
          {selectedTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              defaultValue={selectedTask?.title}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              defaultValue={selectedTask?.description}
            />
            <TextField
              margin="dense"
              name="status"
              label="Status"
              select
              fullWidth
              defaultValue={selectedTask?.status || 'pending'}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              name="priority"
              label="Priority"
              select
              fullWidth
              defaultValue={selectedTask?.priority || 'medium'}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              name="due_date"
              label="Due Date"
              type="date"
              fullWidth
              defaultValue={selectedTask?.due_date?.split('T')[0]}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
            >
              {selectedTask ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 