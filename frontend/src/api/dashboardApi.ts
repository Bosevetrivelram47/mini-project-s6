import axiosClient from './axiosClient';
import type { ApiResponse, DashboardStats } from '@/types';

export const dashboardApi = {
  getStats: () => axiosClient.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
};
