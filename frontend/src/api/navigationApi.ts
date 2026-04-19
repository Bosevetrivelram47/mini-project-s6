import axiosClient from './axiosClient';
import type { ApiResponse, NavigationLog, PagedResponse } from '@/types';

export const navigationApi = {
  log: (data: { userId: number; page: string; url: string; timeSpentSeconds: number }) =>
    axiosClient.post<ApiResponse<NavigationLog>>('/navigation/log', data),
  getAll: (page = 0, size = 20) =>
    axiosClient.get<ApiResponse<PagedResponse<NavigationLog>>>('/navigation', { params: { page, size } }),
  getByUser: (userId: number) =>
    axiosClient.get<ApiResponse<NavigationLog[]>>(`/navigation/user/${userId}`),
};
