import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    details?: unknown;
    stack?: string;
  };
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const isServerFault = statusCode >= 500;

  // Mask internal server faults in production to prevent information disclosure
  const message =
    isServerFault && config.isProduction
      ? 'An unexpected internal server error occurred. Please try again later.'
      : err.message || 'Internal Server Error';

  // Server-side logging for diagnostics
  if (isServerFault && config.nodeEnv !== 'test') {
    console.error(`[Server Error] ${req.method} ${req.url} - Status ${statusCode}:`, err);
  }

  const responseBody: ApiErrorResponse = {
    success: false,
    error: {
      message,
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
      ...(err.details ? { details: err.details } : {}),
    },
  };

  res.status(statusCode).json(responseBody);
};
