import axiosClient from './axiosClient';
import type { ApiResponse, Resolution } from '@/types';

export const resolutionApi = {
  getAll: () => axiosClient.get<ApiResponse<Resolution[]>>('/resolutions'),
  resolve: (data: { taskId: number; remarks?: string }) =>
    axiosClient.post<ApiResponse<Resolution>>('/resolutions', data),
  getByTask: (taskId: number) =>
    axiosClient.get<ApiResponse<Resolution>>(`/resolutions/task/${taskId}`),
};
