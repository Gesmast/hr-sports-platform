import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters'),
  companyName: z
    .string()
    .trim()
    .min(2, 'Company name is required'),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
    .min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
