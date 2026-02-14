import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../services/group.service';
import { CreateGroupRequest, UpdateGroupRequest, Group } from '../types/api.types';
import { useAuthStore } from '../store/auth.store';
import { MOCK_GROUPS, MOCK_RECIPES } from '../utils/mockData';

function isMockSession() {
  return __DEV__ && useAuthStore.getState().token === 'mock-token-dev';
}

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      if (isMockSession()) return [...MOCK_GROUPS];
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
    mutationFn: async (data: CreateGroupRequest): Promise<Group> => {
      if (isMockSession()) {
        const duplicate = MOCK_GROUPS.find(
          (g) => g.name.toLowerCase() === data.name.toLowerCase(),
        );
        if (duplicate) {
          const err: any = new Error('Duplicate');
          err.response = { status: 409 };
          throw err;
        }
        const newGroup: Group = {
          id: `mock-group-${Date.now()}`,
          name: data.name,
          description: data.description,
          userId: 'mock-123',
          recipeCount: 0,
          recipes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        MOCK_GROUPS.push(newGroup);
        return newGroup;
      }
      return groupService.createGroup(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateGroupRequest }): Promise<Group> => {
      if (isMockSession()) {
        const idx = MOCK_GROUPS.findIndex((g) => g.id === id);
        if (idx === -1) throw new Error('Grupo no encontrado');
        if (data.name) {
          const duplicate = MOCK_GROUPS.find(
            (g) => g.name.toLowerCase() === data.name!.toLowerCase() && g.id !== id,
          );
          if (duplicate) {
            const err: any = new Error('Duplicate');
            err.response = { status: 409 };
            throw err;
          }
        }
        MOCK_GROUPS[idx] = {
          ...MOCK_GROUPS[idx],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return MOCK_GROUPS[idx];
      }
      return groupService.updateGroup(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', id] });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isMockSession()) {
        const grp = MOCK_GROUPS.find((g) => g.id === id);
        let deletedRecipes = 0;
        if (grp?.recipes) {
          grp.recipes.forEach((gr) => {
            // delete recipe only if it belongs to no other group
            const recipe = MOCK_RECIPES.find((r) => r.id === gr.id);
            if (recipe) {
              const otherGroups = (recipe.groups ?? []).filter((rg) => rg.group.id !== id);
              if (otherGroups.length === 0) {
                const rIdx = MOCK_RECIPES.findIndex((r) => r.id === gr.id);
                if (rIdx !== -1) { MOCK_RECIPES.splice(rIdx, 1); deletedRecipes++; }
              } else {
                recipe.groups = otherGroups;
              }
            }
          });
        }
        const gIdx = MOCK_GROUPS.findIndex((g) => g.id === id);
        if (gIdx !== -1) MOCK_GROUPS.splice(gIdx, 1);
        return { deletedRecipes };
      }
      return groupService.deleteGroup(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipes', 'mine'] });
    },
  });
}
