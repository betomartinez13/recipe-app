import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/recipe.service';
import { CreateRecipeRequest, UpdateRecipeRequest } from '../types/recipe.types';

export function useAllRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: () => recipeService.getAllRecipes(),
  });
}

export function useMyRecipes() {
  return useQuery({
    queryKey: ['recipes', 'mine'],
    queryFn: () => recipeService.getMyRecipes(),
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ['recipes', id],
    queryFn: () => recipeService.getRecipe(id),
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecipeRequest) => recipeService.createRecipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
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
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useAddToGroups() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, groupIds }: { recipeId: string; groupIds: string[] }) =>
      recipeService.addToGroups(recipeId, groupIds),
    onSuccess: (_, { recipeId }) => {
      queryClient.invalidateQueries({ queryKey: ['recipes', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
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
