import {
  CheckCircle as CompletedIcon,
  Error as HighPriorityIcon,
  Pending as PendingIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { taskAPI } from '../services/api';

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

export default function Dashboard() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskAPI.getTasks().then((res) => res.data),
  });

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  const stats = {
    total: tasks?.length || 0,
    completed: tasks?.filter((task) => task.status === 'done').length || 0,
    pending: tasks?.filter((task) => task.status === 'todo').length || 0,
    highPriority: tasks?.filter((task) => task.priority === 'high').length || 0,
  };

  const recentTasks = tasks
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const upcomingTasks = tasks
    ?.filter((task) => task.status !== 'done')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Tasks
            </Typography>
            <Typography variant="h4">{stats.total}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Completed
            </Typography>
            <Typography variant="h4" color="success.main">
              {stats.completed}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Pending
            </Typography>
            <Typography variant="h4" color="warning.main">
              {stats.pending}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              High Priority
            </Typography>
            <Typography variant="h4" color="error.main">
              {stats.highPriority}
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Tasks
            </Typography>
            <List>
              {recentTasks?.map((task) => (
                <ListItem key={task.id}>
                  <ListItemIcon>
                    <TaskIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title}
                    secondary={format(new Date(task.created_at), 'MMM d, yyyy')}
                  />
                  <Chip
                    label={task.status}
                    color={statusColors[task.status]}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Tasks
            </Typography>
            <List>
              {upcomingTasks?.map((task) => (
                <ListItem key={task.id}>
                  <ListItemIcon>
                    {task.priority === 'high' ? (
                      <HighPriorityIcon color="error" />
                    ) : task.status === 'done' ? (
                      <CompletedIcon color="success" />
                    ) : (
                      <PendingIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title}
                    secondary={`Due: ${format(new Date(task.due_date), 'MMM d, yyyy')}`}
                  />
                  <Chip
                    label={task.priority}
                    color={priorityColors[task.priority]}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 