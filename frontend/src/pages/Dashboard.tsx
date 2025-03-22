import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format, isValid } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
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
  statCard: {
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
  statValue: {
    fontSize: '32px',
    fontWeight: 600,
    color: '#2A2D7C',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: 500,
  },
  recentTaskTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#2A2D7C',
    marginBottom: '16px',
  },
  recentTaskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#2A2D7C',
    marginBottom: '4px',
  },
  taskDueDate: {
    fontSize: '12px',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  taskStatus: {
    marginLeft: '16px',
  },
  chip: {
    borderRadius: '4px',
    height: '24px',
    fontSize: '12px',
    fontWeight: 500,
  },
  icon: {
    marginTop: '16px',
    fontSize: '24px',
  },
  gridContainer: {
    margin: 0,
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
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export default function Dashboard(): JSX.Element {
  const navigate = useNavigate();

  const { data: tasksData, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await taskAPI.getTasks();
      return response.data as Task[];
    },
  });

  const tasks = tasksData || [];

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === TaskStatus.DONE).length,
    inProgress: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length,
    highPriority: tasks.filter(task => task.priority === TaskPriority.HIGH).length,
  };

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h1" sx={styles.title}>
          Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3} sx={styles.gridContainer}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={styles.statCard}>
            <CardContent>
              <Typography sx={styles.statValue}>{stats.total}</Typography>
              <Typography sx={styles.statLabel}>Total Tasks</Typography>
              <AssignmentIcon sx={{ ...styles.icon, color: '#4a148c' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={styles.statCard}>
            <CardContent>
              <Typography sx={styles.statValue}>{stats.completed}</Typography>
              <Typography sx={styles.statLabel}>Completed</Typography>
              <CheckCircleIcon sx={{ ...styles.icon, color: '#2e7d32' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={styles.statCard}>
            <CardContent>
              <Typography sx={styles.statValue}>{stats.inProgress}</Typography>
              <Typography sx={styles.statLabel}>In Progress</Typography>
              <ScheduleIcon sx={{ ...styles.icon, color: '#1976d2' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={styles.statCard}>
            <CardContent>
              <Typography sx={styles.statValue}>{stats.highPriority}</Typography>
              <Typography sx={styles.statLabel}>High Priority</Typography>
              <ErrorIcon sx={{ ...styles.icon, color: '#d32f2f' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={styles.statCard}>
            <CardContent>
              <Typography sx={styles.recentTaskTitle}>
                Recent Tasks
              </Typography>
              {recentTasks.map((task) => (
                <Box key={task.id} sx={styles.recentTaskItem}>
                  <Box sx={styles.taskInfo}>
                    <Typography sx={styles.taskTitle}>{task.title}</Typography>
                    <Typography sx={styles.taskDueDate}>
                      Due: {formatDate(task.dueDate)}
                    </Typography>
                  </Box>
                  <Box sx={styles.taskStatus}>
                    <Chip
                      label={task.status.toLowerCase()}
                      color={statusColors[task.status]}
                      size="small"
                      sx={styles.chip}
                    />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 