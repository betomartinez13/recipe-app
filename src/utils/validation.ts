import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Password es requerido'),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Nombre es requerido'),
    email: z.string().email('Email invalido'),
    password: z.string().min(6, 'Minimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las passwords no coinciden',
    path: ['confirmPassword'],
  });

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  email: z.string().email('Email invalido'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

const ingredientSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  quantity: z.string().min(1, 'Cantidad requerida'),
  unit: z.string().optional(),
});

const stepSchema = z.object({
  description: z.string().min(1, 'Descripcion requerida'),
});

export const createRecipeSchema = z.object({
  title: z.string().min(1, 'Titulo es requerido'),
  description: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1, 'Agrega al menos un ingrediente'),
  steps: z.array(stepSchema).min(1, 'Agrega al menos un paso'),
  groupIds: z.array(z.string()).optional(),
});

export type CreateRecipeFormData = z.infer<typeof createRecipeSchema>;
