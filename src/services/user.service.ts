import { api } from './api';
import { User } from '../types/auth.types';

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.patch<User>('/users/me', data);
    return response.data;
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/users/me');
  },
};
