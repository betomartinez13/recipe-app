import { api } from './api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../types/auth.types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getProfile(): Promise<AuthResponse['user']> {
    const response = await api.get<AuthResponse['user']>('/users/me');
    return response.data;
  },
};
