export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
  order: number;
}

export interface Step {
  id: string;
  description: string;
  order: number;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  userId: string;
  user?: { id: string; name: string };
  ingredients: Ingredient[];
  steps: Step[];
  groups?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  ingredients: Omit<Ingredient, 'id'>[];
  steps: Omit<Step, 'id'>[];
  groupIds?: string[];
}

export interface UpdateRecipeRequest {
  title?: string;
  description?: string;
  ingredients?: Omit<Ingredient, 'id'>[];
  steps?: Omit<Step, 'id'>[];
}
