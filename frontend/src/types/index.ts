export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'user';
  tenant_id: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  created_at: string;
  updated_at: string;
  assigned_to: number;
  created_by: number;
  comments: TaskComment[];
  attachments: TaskAttachment[];
}

export interface TaskComment {
  id: number;
  content: string;
  created_at: string;
  user: number;
  task: number;
  parent?: number;
}

export interface TaskAttachment {
  id: number;
  file: string;
  description: string;
  uploaded_at: string;
  uploaded_by: number;
  task: number;
}

export interface Tenant {
  id: number;
  name: string;
  schema_name: string;
  paid_until: string;
  on_trial: boolean;
  created_on: string;
}

export interface Domain {
  id: number;
  domain: string;
  tenant: number;
  is_primary: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'user';
} 