// ========================
// Entity Types
// ========================

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  active: boolean;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Assignment {
  id: number;
  taskId: number;
  taskTitle: string;
  assignedToId: number;
  assignedToName: string;
  assignedById: number;
  assignedByName: string;
  assignedAt: string;
}

export interface Resolution {
  id: number;
  taskId: number;
  taskTitle: string;
  resolvedById: number;
  resolvedByName: string;
  remarks?: string;
  resolvedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface NavigationLog {
  id: number;
  userId: number;
  userName: string;
  page: string;
  url?: string;
  timeSpentSeconds: number;
  visitedAt: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  entityType: string;
  entityId?: number;
  description: string;
  createdAt: string;
}

// ========================
// API Types
// ========================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ========================
// Auth Types
// ========================

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ========================
// Dashboard Stats
// ========================

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  resolvedTasks: number;
  totalAssignments: number;
}
