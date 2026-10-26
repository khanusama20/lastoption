import { Request, Response, NextFunction } from 'express';
import { shippingService } from '../services/shipping.service';
import { sendSuccess } from '../utils/response';
import { CalculateRatesBody } from '../validators/shipping.validator';

export class ShippingController {
  /**
   * GET /api/v1/shipping/check-pincode
   * Check 6-digit Indian PIN code delivery serviceability and estimated days.
   */
  async checkPincode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pincode = req.query.pincode as string;
      const result = shippingService.checkPincode(pincode);

      sendSuccess(res, {
        statusCode: 200,
        message: result.isServiceable
          ? 'Pincode is serviceable for delivery'
          : 'Pincode is not serviceable for delivery',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/shipping/calculate-rates
   * Calculate live courier delivery rates based on destination pincode, parcel weight, and subtotal.
   */
  async calculateRates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as CalculateRatesBody;
      const result = shippingService.calculateRates(body);

      sendSuccess(res, {
        statusCode: 200,
        message: result.isServiceable
          ? 'Shipping rates calculated successfully'
          : 'Pincode is not serviceable for delivery',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const shippingController = new ShippingController();
