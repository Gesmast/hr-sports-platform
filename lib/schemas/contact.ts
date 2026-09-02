import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name is too long'),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address'),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(5, 'Comment / message must be at least 5 characters')
    .max(4000, 'Message is too long'),
});

export type ContactSchemaType = z.infer<typeof contactSchema>;
