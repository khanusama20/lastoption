import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HttpError } from '../utils/errors';

function formatZodDetails(error: ZodError): Array<{ field: string; message: string }> {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

/**
 * Express middleware to validate request bodies against a Zod schema.
 * Replaces req.body with the sanitized/parsed data upon success.
 * Forwards standardized 400 HttpError to centralized errorHandler upon failure.
 */
export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new HttpError(400, 'Validation failed', formatZodDetails(error)));
        return;
      }

      next(error);
    }
  };
};

/**
 * Express middleware to validate query parameters against a Zod schema.
 * Replaces req.query with the sanitized/parsed data upon success.
 * Forwards standardized 400 HttpError to centralized errorHandler upon failure.
 */
export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.query);
      req.query = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new HttpError(400, 'Validation failed', formatZodDetails(error)));
        return;
      }

      next(error);
    }
  };
};

/**
 * Express middleware to validate route parameters against a Zod schema.
 * Replaces req.params with the sanitized/parsed data upon success.
 * Forwards standardized 400 HttpError to centralized errorHandler upon failure.
 */
export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.params);
      req.params = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new HttpError(400, 'Validation failed', formatZodDetails(error)));
        return;
      }

      next(error);
    }
  };
};
