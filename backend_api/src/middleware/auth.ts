import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { verifyToken } from '../utils/jwt';
import { AuthenticatedUser } from '../types/auth.types';

/**
 * Middleware ensuring the request is authenticated via HttpOnly cookie or Bearer token.
 * Populates req.user with the verified identity.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // 1. Primary: Extract from secure HttpOnly cookie
  if (req.cookies && req.cookies[config.cookieName]) {
    token = req.cookies[config.cookieName];
  }
  // 2. Secondary fallback: Extract from Authorization Bearer header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required. Please sign in to proceed.',
      },
    });
    return;
  }

  try {
    const payload = verifyToken(token);
    const user: AuthenticatedUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    req.user = user;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired authentication token. Please sign in again.',
      },
    });
  }
};

/**
 * Middleware ensuring the authenticated user has the 'admin' role.
 * Must be mounted after requireAuth.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required.',
      },
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: {
        message: 'Access forbidden: administrator privileges required.',
      },
    });
    return;
  }

  next();
};
