import { api } from './api';
import { Group, CreateGroupRequest, UpdateGroupRequest } from '../types/api.types';

export const groupService = {
  getGroups: async (): Promise<Group[]> => {
    const response = await api.get<Group[]>('/groups');
    return response.data;
  },

  getGroup: async (id: string): Promise<Group> => {
    const response = await api.get<Group>(`/groups/${id}`);
    return response.data;
  },

  createGroup: async (data: CreateGroupRequest): Promise<Group> => {
    const response = await api.post<Group>('/groups', data);
    return response.data;
  },

  updateGroup: async (id: string, data: UpdateGroupRequest): Promise<Group> => {
    const response = await api.patch<Group>(`/groups/${id}`, data);
    return response.data;
  },

  deleteGroup: async (id: string): Promise<void> => {
    await api.delete(`/groups/${id}`);
  },
};
