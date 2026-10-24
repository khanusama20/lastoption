import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { sendSuccess } from '../utils/response';

const router = Router();

// Base health and monitoring route
router.use('/', healthRoutes);

// Authentication & Profile routes (/api/v1/auth)
router.use('/auth', authRoutes);

// Admin authorization verification route (/api/v1/admin/verify)
router.get('/admin/verify', requireAuth, requireAdmin, (req, res) => {
  sendSuccess(res, {
    statusCode: 200,
    message: 'Admin privileges verified',
    data: { user: req.user },
  });
});

export default router;
