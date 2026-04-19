import axiosClient from './axiosClient';
import type { ApiResponse, User } from '@/types';

export const userApi = {
  getAll: () => axiosClient.get<ApiResponse<User[]>>('/users'),
  getById: (id: number) => axiosClient.get<ApiResponse<User>>(`/users/${id}`),
  getByRole: (role: string) => axiosClient.get<ApiResponse<User[]>>(`/users/role/${role}`),
  create: (data: { name: string; email: string; password: string; role: string }) =>
    axiosClient.post<ApiResponse<User>>('/users', data),
  activate: (id: number) => axiosClient.patch<ApiResponse<User>>(`/users/${id}/activate`),
  deactivate: (id: number) => axiosClient.patch<ApiResponse<User>>(`/users/${id}/deactivate`),
};
