import { api } from './api';
import { Recipe, CreateRecipeRequest, UpdateRecipeRequest } from '../types/recipe.types';

export const recipeService = {
  getAllRecipes: async (): Promise<Recipe[]> => {
    const response = await api.get<Recipe[]>('/recipes');
    return response.data;
  },

  getMyRecipes: async (): Promise<Recipe[]> => {
    const response = await api.get<Recipe[]>('/recipes/mine');
    return response.data;
  },

  getRecipe: async (id: string): Promise<Recipe> => {
    const response = await api.get<Recipe>(`/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (data: CreateRecipeRequest): Promise<Recipe> => {
    const response = await api.post<Recipe>('/recipes', data);
    return response.data;
  },

  updateRecipe: async (id: string, data: UpdateRecipeRequest): Promise<Recipe> => {
    const response = await api.patch<Recipe>(`/recipes/${id}`, data);
    return response.data;
  },

  deleteRecipe: async (id: string): Promise<void> => {
    await api.delete(`/recipes/${id}`);
  },

  addToGroups: async (recipeId: string, groupIds: string[]): Promise<Recipe> => {
    const response = await api.post<Recipe>(`/recipes/${recipeId}/groups`, { groupIds });
    return response.data;
  },

  removeFromGroup: async (recipeId: string, groupId: string): Promise<void> => {
    await api.delete(`/recipes/${recipeId}/groups/${groupId}`);
  },
};
