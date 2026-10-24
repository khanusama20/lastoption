import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password cannot exceed 100 characters'),
  firstName: z
    .string()
    .trim()
    .max(100, 'First name cannot exceed 100 characters')
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(100, 'Last name cannot exceed 100 characters')
    .optional(),
  phone: z
    .string()
    .trim()
    .max(20, 'Phone number cannot exceed 20 characters')
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(100, 'First name cannot exceed 100 characters')
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(100, 'Last name cannot exceed 100 characters')
    .optional(),
  phone: z
    .string()
    .trim()
    .max(20, 'Phone number cannot exceed 20 characters')
    .optional(),
});
