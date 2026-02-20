export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
  order: number;
  recipeId?: string;
}

export interface Step {
  id: string;
  description: string;
  order: number;
  recipeId?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  userId: string;
  user?: { id: string; name: string; email: string };
  ingredients: Ingredient[];
  steps: Step[];
  groups?: { group: { id: string; name: string; description?: string } }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  ingredients: Omit<Ingredient, 'id' | 'recipeId'>[];
  steps: Omit<Step, 'id' | 'recipeId'>[];
  groupIds?: string[];
}

export interface UpdateRecipeRequest {
  title?: string;
  description?: string;
  ingredients?: Omit<Ingredient, 'id' | 'recipeId'>[];
  steps?: Omit<Step, 'id' | 'recipeId'>[];
}
