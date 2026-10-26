import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import shippingRoutes from './shipping.routes';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { sendSuccess } from '../utils/response';

const router = Router();

// Base health and monitoring route
router.use('/', healthRoutes);

// Authentication & Profile routes (/api/v1/auth)
router.use('/auth', authRoutes);

// Product Catalog & Inventory routes (/api/v1/products)
router.use('/products', productRoutes);

// Shipping & Courier Serviceability routes (/api/v1/shipping)
router.use('/shipping', shippingRoutes);

// Admin authorization verification route (/api/v1/admin/verify)
router.get('/admin/verify', requireAuth, requireAdmin, (req, res) => {
  sendSuccess(res, {
    statusCode: 200,
    message: 'Admin privileges verified',
    data: { user: req.user },
  });
});

export default router;
