import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface SendSuccessOptions<T> {
  statusCode?: number;
  message?: string;
  data?: T;
}

/**
 * Standardized helper for generating successful JSON API responses.
 * Guarantees consistent response envelope across all controllers.
 */
export function sendSuccess<T>(res: Response, options: SendSuccessOptions<T> = {}): Response {
  const { statusCode = 200, message, data } = options;

  const body: ApiResponse<T> = {
    success: true,
    ...(message !== undefined && { message }),
    ...(data !== undefined && { data }),
  };

  return res.status(statusCode).json(body);
}
