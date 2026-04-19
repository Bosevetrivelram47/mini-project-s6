import axiosClient from './axiosClient';
import type { ApiResponse, AuthUser, LoginRequest } from '@/types';

export const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post<ApiResponse<AuthUser>>('/auth/login', data),
};
