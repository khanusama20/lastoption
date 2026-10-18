import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

// Base health and monitoring route
router.use('/', healthRoutes);

export default router;
