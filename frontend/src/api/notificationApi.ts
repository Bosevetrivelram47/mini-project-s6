import axiosClient from './axiosClient';
import type { ApiResponse, Notification } from '@/types';

export const notificationApi = {
  getMy: () => axiosClient.get<ApiResponse<Notification[]>>('/notifications/my'),
  getUnreadCount: () =>
    axiosClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count'),
  markAsRead: (id: number) =>
    axiosClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`),
  markAllAsRead: () =>
    axiosClient.patch<ApiResponse<void>>('/notifications/mark-all-read'),
};
