import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Express middleware to validate request bodies against a Zod schema.
 * Replaces req.body with the sanitized/parsed data upon success.
 * Returns standardized 400 Bad Request with field-level details upon failure.
 */
export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details,
          },
        });
        return;
      }

      next(error);
    }
  };
};
