import axiosClient from './axiosClient';
import type { ApiResponse, Assignment } from '@/types';

export const assignmentApi = {
  getAll: () => axiosClient.get<ApiResponse<Assignment[]>>('/assignments'),
  assign: (data: { taskId: number; assignedToUserId: number }) =>
    axiosClient.post<ApiResponse<Assignment>>('/assignments', data),
  getByTask: (taskId: number) =>
    axiosClient.get<ApiResponse<Assignment[]>>(`/assignments/task/${taskId}`),
  getByUser: (userId: number) =>
    axiosClient.get<ApiResponse<Assignment[]>>(`/assignments/user/${userId}`),
};
