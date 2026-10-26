import { z } from 'zod';

export const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

export const checkPincodeQuerySchema = z.object({
  pincode: z
    .string({ required_error: 'Pincode is required' })
    .trim()
    .regex(PINCODE_REGEX, 'Invalid Indian pincode format. Must be a 6-digit number starting with 1-9.'),
});

export type CheckPincodeQuery = z.infer<typeof checkPincodeQuerySchema>;

export const calculateRatesBodySchema = z.object({
  pincode: z
    .string({ required_error: 'Pincode is required' })
    .trim()
    .regex(PINCODE_REGEX, 'Invalid Indian pincode format. Must be a 6-digit number starting with 1-9.'),
  weightGrams: z
    .number({ invalid_type_error: 'Weight must be a number' })
    .int('Weight must be an integer')
    .min(1, 'Weight must be at least 1 gram')
    .max(50000, 'Weight cannot exceed 50,000 grams (50kg)')
    .default(1000),
  subtotal: z
    .number({ invalid_type_error: 'Subtotal must be a number' })
    .int('Subtotal must be an integer in paise')
    .min(0, 'Subtotal cannot be negative')
    .default(0),
});

export type CalculateRatesBody = z.infer<typeof calculateRatesBodySchema>;
