import { Recipe } from './recipe.types';

export interface ApiError {
  statusCode: number;
  message: string[];
  timestamp: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  recipeCount?: number;
  recipes?: Recipe[];
  createdAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
}
