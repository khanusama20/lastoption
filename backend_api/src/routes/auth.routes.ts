import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { loginRateLimiter } from '../middleware/rateLimiter';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/auth.validator';

const router = Router();

// Public routes
router.post(
  '/register',
  validateBody(registerSchema),
  authController.register.bind(authController)
);

router.post(
  '/login',
  loginRateLimiter,
  validateBody(loginSchema),
  authController.login.bind(authController)
);

// Protected routes (Requires authentication)
router.post(
  '/logout',
  requireAuth,
  authController.logout.bind(authController)
);

router.get(
  '/me',
  requireAuth,
  authController.getMe.bind(authController)
);

router.put(
  '/profile',
  requireAuth,
  validateBody(updateProfileSchema),
  authController.updateProfile.bind(authController)
);

export default router;
