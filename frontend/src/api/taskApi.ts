import axiosClient from './axiosClient';
import type { ApiResponse, Task, PagedResponse } from '@/types';

export const taskApi = {
  getAll: () => axiosClient.get<ApiResponse<Task[]>>('/tasks/all'),
  getPaged: (params: { status?: string; priority?: string; search?: string; page?: number; size?: number }) =>
    axiosClient.get<ApiResponse<PagedResponse<Task>>>('/tasks', { params }),
  getById: (id: number) => axiosClient.get<ApiResponse<Task>>(`/tasks/${id}`),
  create: (data: { title: string; description?: string; priority?: string; dueDate?: string }) =>
    axiosClient.post<ApiResponse<Task>>('/tasks', data),
  updateStatus: (id: number, status: string) =>
    axiosClient.patch<ApiResponse<Task>>(`/tasks/${id}/status?status=${status}`),
};
