import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/recipe.service';
import { CreateRecipeRequest, UpdateRecipeRequest } from '../types/recipe.types';
import { useAuthStore } from '../store/auth.store';
import { MOCK_RECIPES } from '../utils/mockData';

function isMockSession() {
  return __DEV__ && useAuthStore.getState().token === 'mock-token-dev';
}

export function useAllRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      if (isMockSession()) return MOCK_RECIPES;
      return recipeService.getAllRecipes();
    },
  });
}

export function useMyRecipes() {
  return useQuery({
    queryKey: ['recipes', 'mine'],
    queryFn: async () => {
      if (isMockSession()) {
        return MOCK_RECIPES.filter((r) => r.authorId === 'mock-123');
      }
      return recipeService.getMyRecipes();
    },
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ['recipes', id],
    queryFn: async () => {
      if (isMockSession()) {
        const found = MOCK_RECIPES.find((r) => r.id === id);
        if (!found) throw new Error('Receta no encontrada');
        return found;
      }
      return recipeService.getRecipe(id);
    },
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecipeRequest) => recipeService.createRecipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecipeRequest }) =>
      recipeService.updateRecipe(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipes', id] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipeService.deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useRemoveFromGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, groupId }: { recipeId: string; groupId: string }) =>
      recipeService.removeFromGroup(recipeId, groupId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
