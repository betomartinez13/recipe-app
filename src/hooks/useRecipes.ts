import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/recipe.service';
import { CreateRecipeRequest, UpdateRecipeRequest, Recipe } from '../types/recipe.types';
import { useAuthStore } from '../store/auth.store';
import { MOCK_RECIPES, MOCK_GROUPS } from '../utils/mockData';

function isMockSession() {
  return __DEV__ && useAuthStore.getState().token === 'mock-token-dev';
}

export function useAllRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      if (isMockSession()) return [...MOCK_RECIPES];
      return recipeService.getAllRecipes();
    },
  });
}

export function useMyRecipes() {
  return useQuery({
    queryKey: ['recipes', 'mine'],
    queryFn: async () => {
      if (isMockSession()) return MOCK_RECIPES.filter((r) => r.authorId === 'mock-123');
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
    mutationFn: async (data: CreateRecipeRequest): Promise<Recipe> => {
      if (isMockSession()) {
        const duplicate = MOCK_RECIPES.find(
          (r) => r.title.toLowerCase() === data.title.toLowerCase() && r.authorId === 'mock-123',
        );
        if (duplicate) {
          const err: any = new Error('Duplicate');
          err.response = { status: 409 };
          throw err;
        }
        const newRecipe: Recipe = {
          id: `mock-recipe-${Date.now()}`,
          title: data.title,
          description: data.description,
          authorId: 'mock-123',
          author: { id: 'mock-123', name: 'Alberto', email: 'alberto@test.com' },
          ingredients: data.ingredients.map((ing, i) => ({ ...ing, id: `ing-${Date.now()}-${i}` })),
          steps: data.steps.map((s, i) => ({ ...s, id: `step-${Date.now()}-${i}` })),
          groups: (data.groupIds ?? []).map((gId) => {
            const g = MOCK_GROUPS.find((gr) => gr.id === gId);
            return { group: { id: gId, name: g?.name ?? '' } };
          }),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        MOCK_RECIPES.push(newRecipe);
        // update group recipe counts
        (data.groupIds ?? []).forEach((gId) => {
          const grp = MOCK_GROUPS.find((g) => g.id === gId);
          if (grp) {
            grp.recipeCount = (grp.recipeCount ?? 0) + 1;
            grp.recipes = grp.recipes ?? [];
            grp.recipes.push({ id: newRecipe.id, title: newRecipe.title, authorId: 'mock-123' });
          }
        });
        return newRecipe;
      }
      return recipeService.createRecipe(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRecipeRequest }): Promise<Recipe> => {
      if (isMockSession()) {
        const idx = MOCK_RECIPES.findIndex((r) => r.id === id);
        if (idx === -1) throw new Error('Receta no encontrada');
        if (data.title) {
          const duplicate = MOCK_RECIPES.find(
            (r) => r.title.toLowerCase() === data.title!.toLowerCase() && r.authorId === 'mock-123' && r.id !== id,
          );
          if (duplicate) {
            const err: any = new Error('Duplicate');
            err.response = { status: 409 };
            throw err;
          }
        }
        MOCK_RECIPES[idx] = {
          ...MOCK_RECIPES[idx],
          ...data,
          ingredients: data.ingredients
            ? data.ingredients.map((ing, i) => ({ ...ing, id: `ing-${Date.now()}-${i}` }))
            : MOCK_RECIPES[idx].ingredients,
          steps: data.steps
            ? data.steps.map((s, i) => ({ ...s, id: `step-${Date.now()}-${i}` }))
            : MOCK_RECIPES[idx].steps,
          updatedAt: new Date().toISOString(),
        };
        return MOCK_RECIPES[idx];
      }
      return recipeService.updateRecipe(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipes', id] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (isMockSession()) {
        const idx = MOCK_RECIPES.findIndex((r) => r.id === id);
        if (idx !== -1) MOCK_RECIPES.splice(idx, 1);
        // remove from groups too
        MOCK_GROUPS.forEach((g) => {
          if (g.recipes) {
            g.recipes = g.recipes.filter((r) => r.id !== id);
            g.recipeCount = g.recipes.length;
          }
        });
        return;
      }
      return recipeService.deleteRecipe(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useRemoveFromGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ recipeId, groupId }: { recipeId: string; groupId: string }): Promise<void> => {
      if (isMockSession()) {
        const grp = MOCK_GROUPS.find((g) => g.id === groupId);
        if (grp && grp.recipes) {
          grp.recipes = grp.recipes.filter((r) => r.id !== recipeId);
          grp.recipeCount = grp.recipes.length;
        }
        const recipe = MOCK_RECIPES.find((r) => r.id === recipeId);
        if (recipe && recipe.groups) {
          recipe.groups = recipe.groups.filter((g) => g.group.id !== groupId);
        }
        return;
      }
      return recipeService.removeFromGroup(recipeId, groupId);
    },
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
