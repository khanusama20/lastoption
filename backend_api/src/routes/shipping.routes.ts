import { Router } from 'express';
import { shippingController } from '../controllers/shipping.controller';
import { validateQuery, validateBody } from '../middleware/validate';
import {
  checkPincodeQuerySchema,
  calculateRatesBodySchema,
} from '../validators/shipping.validator';

const router = Router();

// GET /api/v1/shipping/check-pincode - Query 6-digit PIN serviceability & estimated days
router.get(
  '/check-pincode',
  validateQuery(checkPincodeQuerySchema),
  shippingController.checkPincode.bind(shippingController)
);

// POST /api/v1/shipping/calculate-rates - Calculate live courier rates based on weight & destination
router.post(
  '/calculate-rates',
  validateBody(calculateRatesBodySchema),
  shippingController.calculateRates.bind(shippingController)
);

export default router;
