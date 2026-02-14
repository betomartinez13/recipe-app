import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../services/group.service';
import { CreateGroupRequest, UpdateGroupRequest } from '../types/api.types';
import { useAuthStore } from '../store/auth.store';
import { MOCK_GROUPS } from '../utils/mockData';

function isMockSession() {
  return __DEV__ && useAuthStore.getState().token === 'mock-token-dev';
}

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      if (isMockSession()) return MOCK_GROUPS;
      return groupService.getGroups();
    },
  });
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: async () => {
      if (isMockSession()) {
        const found = MOCK_GROUPS.find((g) => g.id === id);
        if (!found) throw new Error('Grupo no encontrado');
        return found;
      }
      return groupService.getGroup(id);
    },
    enabled: !!id,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGroupRequest) => groupService.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGroupRequest }) =>
      groupService.updateGroup(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', id] });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => groupService.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipes', 'mine'] });
    },
  });
}
