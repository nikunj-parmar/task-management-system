export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'user';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  created_at: string;
  updated_at: string;
  assigned_to: number;
  created_by: number;
  comments: Comment[];
  attachments: Attachment[];
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  created_by: number;
}

export interface Attachment {
  id: number;
  file: string;
  description: string;
  created_at: string;
  created_by: number;
} 