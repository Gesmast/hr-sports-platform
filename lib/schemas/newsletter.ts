import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please provide a valid corporate email address')
    .max(120, 'Email address is too long'),
});

export type NewsletterSchemaType = z.infer<typeof newsletterSchema>;
