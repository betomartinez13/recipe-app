export interface ApiError {
  statusCode: number;
  message: string[];
  timestamp: string;
}

export interface GroupRecipe {
  id: string;
  title: string;
  description?: string;
  userId: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  userId?: string;
  recipeCount?: number;
  recipes?: GroupRecipe[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
}

export interface DeleteGroupResponse {
  deletedRecipes: number;
}
