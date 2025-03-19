import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, Task, User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        const { access } = response.data;
        localStorage.setItem('token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const userAPI = {
  login: (credentials: LoginCredentials) => api.post<AuthResponse>('/api/token/', credentials),
  register: (data: RegisterData) => api.post<AuthResponse>('/api/token/', data),
  getCurrentUser: () => api.get<User>('/api/users/me/'),
  getUser: (id: number) => api.get<User>(`/api/users/${id}/`),
  getUsers: () => api.get<User[]>('/api/users/'),
  createUser: (data: Partial<User>) => api.post<User>('/api/users/', data),
  updateUser: (id: number, data: Partial<User>) => api.patch<User>(`/api/users/${id}/`, data),
  deleteUser: (id: number) => api.delete(`/api/users/${id}/`),
  updatePassword: (currentPassword: string, newPassword: string) =>
    api.post('/api/users/change-password/', { current_password: currentPassword, new_password: newPassword }),
};

export const taskAPI = {
  getTasks: () => api.get<Task[]>('/api/tasks/'),
  getTask: (id: number) => api.get<Task>(`/api/tasks/${id}/`),
  createTask: (data: Partial<Task>) => api.post<Task>('/api/tasks/', data),
  updateTask: (id: number, data: Partial<Task>) => api.patch<Task>(`/api/tasks/${id}/`, data),
  deleteTask: (id: number) => api.delete(`/api/tasks/${id}/`),
  addComment: (taskId: number, content: string) =>
    api.post(`/api/tasks/${taskId}/comments/`, { content }),
  addAttachment: (taskId: number, file: File, description: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    return api.post(`/api/tasks/${taskId}/attachments/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api; 