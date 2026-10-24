import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { setAuthCookie, clearAuthCookie } from '../utils/cookies';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Registers a customer account, assigns a session cookie, and returns user profile.
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, token } = await authService.register(req.body);
      setAuthCookie(res, token);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   * Authenticates user, assigns a session cookie, and returns user profile.
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, token } = await authService.login(req.body);
      setAuthCookie(res, token);

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Clears the session cookie.
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      clearAuthCookie(res);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   * Returns current authenticated user profile.
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getProfile(req.user!.id);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/auth/profile
   * Updates current authenticated user profile.
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.updateProfile(req.user!.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
