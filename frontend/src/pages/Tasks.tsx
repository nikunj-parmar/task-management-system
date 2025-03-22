import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
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
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format, isValid } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskDrawer from '../components/tasks/TaskDrawer';
import { useAuth } from '../hooks/useAuth';
import { taskAPI } from '../services/api';
import { commonStyles } from '../styles/common';
import { Task, TaskPriority, TaskStatus } from '../types/task';

const styles = {
  container: {
    padding: '24px',
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
  taskList: {
    margin: 0,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)',
    },
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
  taskTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#2A2D7C',
    marginBottom: '8px',
  },
  taskDescription: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: '16px',
  },
  taskDueDate: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: '16px',
  },
  taskActions: {
    display: 'flex',
    gap: '8px',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  actionButtons: {
    display: 'flex',
    gap: '4px',
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
  chip: {
    borderRadius: '4px',
    height: '24px',
    fontSize: '12px',
    fontWeight: 500,
  },
} as const;

const statusColors: Record<TaskStatus, 'default' | 'primary' | 'success' | 'warning'> = {
  [TaskStatus.TODO]: 'default',
  [TaskStatus.IN_PROGRESS]: 'primary',
  [TaskStatus.DONE]: 'success',
};

const priorityColors: Record<TaskPriority, 'error' | 'success' | 'warning'> = {
  [TaskPriority.HIGH]: 'error',
  [TaskPriority.MEDIUM]: 'warning',
  [TaskPriority.LOW]: 'success',
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (!isValid(date)) {
      return 'Invalid date';
    }
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    return 'Invalid date';
  }
};

export default function Tasks(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: tasksData, isLoading, refetch } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await taskAPI.getTasks();
      return response.data as Task[];
    },
  });

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData);
    }
    setLoading(isLoading);
  }, [tasksData, isLoading]);

  const handleCreateTask = async (data: Partial<Task>) => {
    try {
      const newTask = await taskAPI.createTask(data);
      refetch();
      setDrawerOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdateTask = async (data: Partial<Task>) => {
    if (!editingTask) return;

    try {
      const updatedTask = await taskAPI.updateTask(editingTask.id, data);
      refetch();
      setDrawerOpen(false);
      setEditingTask(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      await taskAPI.deleteTask(selectedTask.id);
      refetch();
      setDeleteDialogOpen(false);
      setSelectedTask(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleEditClick = () => {
    if (selectedTask) {
      setEditingTask(selectedTask);
      setDrawerOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const getPriorityColor = (priority: TaskPriority) => {
    return priorityColors[priority] || 'default';
  };

  const getStatusColor = (status: TaskStatus) => {
    return statusColors[status] || 'default';
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h1" sx={styles.title}>
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingTask(undefined);
            setDrawerOpen(true);
          }}
          sx={styles.addButton}
        >
          Add Task
        </Button>
      </Box>

      <Grid container spacing={3} sx={styles.taskList}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card sx={styles.taskCard}>
              <CardContent>
                <Box sx={styles.taskHeader}>
                  <Typography sx={styles.taskTitle}>
                    {task.title}
                  </Typography>
                  <Box sx={styles.actionButtons}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, task)}
                      sx={{ ...styles.iconButton, ...styles.editButton }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedTask(task);
                        setDeleteDialogOpen(true);
                      }}
                      sx={{ ...styles.iconButton, ...styles.deleteButton }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography sx={styles.taskDescription}>
                  {task.description}
                </Typography>
                <Typography sx={styles.taskDueDate}>
                  Due: {formatDate(task.dueDate)}
                </Typography>
                <Box sx={styles.taskActions}>
                  <Chip
                    label={task.priority.toLowerCase()}
                    color={getPriorityColor(task.priority)}
                    size="small"
                    sx={styles.chip}
                  />
                  <Chip
                    label={task.status.toLowerCase()}
                    color={getStatusColor(task.status)}
                    size="small"
                    sx={styles.chip}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
            mt: 1.5,
            borderRadius: '12px',
            minWidth: '180px',
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
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: '#1a237e' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#d32f2f' }}>Delete</Typography>
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: commonStyles.dialog,
        }}
      >
        <DialogTitle sx={commonStyles.dialogTitle}>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={commonStyles.dialogActions}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTask}
            variant="contained"
            sx={commonStyles.deleteButton}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <TaskDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        isEditing={!!editingTask}
      />
    </Box>
  );
} 