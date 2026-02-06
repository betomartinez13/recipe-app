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

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
