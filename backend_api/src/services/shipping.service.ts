import {
  PincodeServiceabilityResponse,
  CalculateRatesResponse,
  ShippingRateOption,
} from '../types/shipping.types';
import { CalculateRatesBody } from '../validators/shipping.validator';

export const FREE_SHIPPING_THRESHOLD_PAISE = 299900; // ₹2,999 in paise

interface PincodeLocation {
  city: string;
  state: string;
  isMetro: boolean;
  isServiceable: boolean;
  baseDays: number;
}

// Known major Indian metropolitan pincode ranges
function resolveKnownMetros(pincode: string): PincodeLocation | null {
  const pin = parseInt(pincode, 10);

  // Delhi / NCR
  if (pin >= 110001 && pin <= 110099) {
    return { city: 'New Delhi', state: 'Delhi', isMetro: true, isServiceable: true, baseDays: 2 };
  }
  if (pin >= 122001 && pin <= 122018) {
    return { city: 'Gurugram', state: 'Haryana', isMetro: true, isServiceable: true, baseDays: 2 };
  }
  if (pin >= 201301 && pin <= 201310) {
    return { city: 'Noida', state: 'Uttar Pradesh', isMetro: true, isServiceable: true, baseDays: 2 };
  }

  // Mumbai & Pune
  if (pin >= 400001 && pin <= 400104) {
    return { city: 'Mumbai', state: 'Maharashtra', isMetro: true, isServiceable: true, baseDays: 2 };
  }
  if (pin >= 411001 && pin <= 411060) {
    return { city: 'Pune', state: 'Maharashtra', isMetro: true, isServiceable: true, baseDays: 3 };
  }

  // Bengaluru
  if (pin >= 560001 && pin <= 560100) {
    return { city: 'Bengaluru', state: 'Karnataka', isMetro: true, isServiceable: true, baseDays: 2 };
  }

  // Hyderabad
  if (pin >= 500001 && pin <= 500099) {
    return { city: 'Hyderabad', state: 'Telangana', isMetro: true, isServiceable: true, baseDays: 2 };
  }

  // Chennai
  if (pin >= 600001 && pin <= 600100) {
    return { city: 'Chennai', state: 'Tamil Nadu', isMetro: true, isServiceable: true, baseDays: 2 };
  }

  // Kolkata
  if (pin >= 700001 && pin <= 700100) {
    return { city: 'Kolkata', state: 'West Bengal', isMetro: true, isServiceable: true, baseDays: 2 };
  }

  // Ahmedabad
  if (pin >= 380001 && pin <= 380060) {
    return { city: 'Ahmedabad', state: 'Gujarat', isMetro: true, isServiceable: true, baseDays: 3 };
  }

  // Jaipur
  if (pin >= 302001 && pin <= 302039) {
    return { city: 'Jaipur', state: 'Rajasthan', isMetro: true, isServiceable: true, baseDays: 3 };
  }

  return null;
}

// Indian postal circle prefix resolution (First 2 digits)
function resolveByCirclePrefix(pincode: string): PincodeLocation {
  const prefix = parseInt(pincode.substring(0, 2), 10);

  // Army Postal Service / Restricted military zones (Non-commercial logistics)
  if (prefix >= 90 || pincode === '999999') {
    return { city: 'Restricted Area', state: 'Army Post Office', isMetro: false, isServiceable: false, baseDays: 0 };
  }

  if (prefix === 11) {
    return { city: 'Delhi', state: 'Delhi', isMetro: true, baseDays: 2, isServiceable: true };
  }
  if (prefix === 12 || prefix === 13) {
    return { city: 'Ambala', state: 'Haryana', isMetro: false, baseDays: 3, isServiceable: true };
  }
  if (prefix >= 14 && prefix <= 16) {
    return { city: 'Chandigarh / Ludhiana', state: 'Punjab', isMetro: false, baseDays: 3, isServiceable: true };
  }
  if (prefix === 17) {
    return { city: 'Shimla', state: 'Himachal Pradesh', isMetro: false, baseDays: 4, isServiceable: true };
  }
  if (prefix === 18 || prefix === 19) {
    return { city: 'Srinagar / Jammu', state: 'Jammu and Kashmir', isMetro: false, baseDays: 4, isServiceable: true };
  }
  if (prefix >= 20 && prefix <= 28) {
    return { city: 'Lucknow / Dehradun', state: 'Uttar Pradesh', isMetro: false, baseDays: 3, isServiceable: true };
  }
  if (prefix >= 30 && prefix <= 34) {
    return { city: 'Jaipur / Jodhpur', state: 'Rajasthan', isMetro: false, baseDays: 3, isServiceable: true };
  }
  if (prefix >= 36 && prefix <= 39) {
    return { city: 'Ahmedabad / Surat', state: 'Gujarat', isMetro: false, baseDays: 3, isServiceable: true };
  }
  if (prefix >= 40 && prefix <= 44) {
    return { city: 'Nagpur / Goa', state: 'Maharashtra', isMetro: false, baseDays: 3, isServiceable: true };
  }
  if (prefix >= 45 && prefix <= 48) {
    return { city: 'Bhopal / Indore', state: 'Madhya Pradesh', isMetro: false, baseDays: 4, isServiceable: true };
  }
  if (prefix === 49) {
    return { city: 'Raipur', state: 'Chhattisgarh', isMetro: false, baseDays: 4, isServiceable: true };
  }
  if (prefix >= 50 && prefix <= 53) {
    return { city: 'Hyderabad / Vijayawada', state: 'Andhra Pradesh / Telangana', isMetro: false, baseDays: 3, isServiceable: true };
  }
  if (prefix >= 56 && prefix <= 59) {
    return { city: 'Mysuru / Hubballi', state: 'Karnataka', isMetro: false, baseDays: 3, isServiceable: true };
  }
  if (prefix >= 60 && prefix <= 66) {
    return { city: 'Madurai / Coimbatore', state: 'Tamil Nadu', isMetro: false, baseDays: 3, isServiceable: true };
  }
  if (prefix >= 67 && prefix <= 69) {
    return { city: 'Kochi / Thiruvananthapuram', state: 'Kerala', isMetro: false, baseDays: 3, isServiceable: true };
  }
  if (prefix >= 70 && prefix <= 74) {
    return { city: 'Siliguri / Asansol', state: 'West Bengal', isMetro: false, baseDays: 4, isServiceable: true };
  }
  if (prefix >= 75 && prefix <= 77) {
    return { city: 'Bhubaneswar / Cuttack', state: 'Odisha', isMetro: false, baseDays: 4, isServiceable: true };
  }
  if (prefix === 78) {
    return { city: 'Guwahati', state: 'Assam', isMetro: false, baseDays: 5, isServiceable: true };
  }
  if (prefix === 79) {
    return { city: 'Shillong / Agartala', state: 'North Eastern Region', isMetro: false, baseDays: 5, isServiceable: true };
  }
  if (prefix >= 80 && prefix <= 85) {
    return { city: 'Patna / Ranchi', state: 'Bihar / Jharkhand', isMetro: false, baseDays: 4, isServiceable: true };
  }

  // Fallback default for any remaining valid 1-9 Indian circle
  return { city: 'Regional Hub', state: 'India', isMetro: false, isServiceable: true, baseDays: 4 };
}

function resolveLocation(pincode: string): PincodeLocation {
  const metro = resolveKnownMetros(pincode);
  if (metro) return metro;
  return resolveByCirclePrefix(pincode);
}

function calculateEstimatedDate(days: number): string {
  const targetDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return targetDate.toISOString().split('T')[0];
}

export class ShippingService {
  /**
   * Check if a 6-digit Indian postal code is serviceable for delivery and COD.
   */
  checkPincode(pincode: string): PincodeServiceabilityResponse {
    const loc = resolveLocation(pincode);

    if (!loc.isServiceable) {
      return {
        pincode,
        isServiceable: false,
        city: null,
        state: null,
        estimatedDays: null,
        estimatedDeliveryDate: null,
        codAvailable: false,
        courier: null,
        message: 'Delivery is currently not available for this pincode.',
      };
    }

    const estimatedDays = loc.baseDays;
    const estimatedDeliveryDate = calculateEstimatedDate(estimatedDays);

    return {
      pincode,
      isServiceable: true,
      city: loc.city,
      state: loc.state,
      estimatedDays,
      estimatedDeliveryDate,
      codAvailable: true,
      courier: 'Delhivery Express',
      message: 'Pincode is serviceable for delivery.',
    };
  }

  /**
   * Calculate live courier shipping rates based on destination pincode, parcel weight, and order subtotal.
   * Free Express Shipping nationwide on orders over ₹2,999 (299900 paise).
   */
  calculateRates(body: CalculateRatesBody): CalculateRatesResponse {
    const { pincode, weightGrams, subtotal } = body;
    const loc = resolveLocation(pincode);

    if (!loc.isServiceable) {
      return {
        pincode,
        isServiceable: false,
        city: null,
        state: null,
        isFreeShipping: false,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD_PAISE,
        codAvailable: false,
        rates: [],
        message: 'Delivery is currently not available for this pincode.',
      };
    }

    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_PAISE;

    // Weight slab calculation: base rate for first 1000g, extra per 500g slab
    const extraWeight = Math.max(0, weightGrams - 1000);
    const extraSlabs = Math.ceil(extraWeight / 500);

    const standardDays = loc.baseDays;
    const expressDays = Math.max(1, Math.min(2, loc.baseDays - 1));

    let standardFee = 9900 + extraSlabs * 5000; // ₹99 + ₹50 per extra 500g
    let expressFee = 19900 + extraSlabs * 8000; // ₹199 + ₹80 per extra 500g

    if (isFreeShipping) {
      standardFee = 0;
      expressFee = 0;
    }

    const rates: ShippingRateOption[] = [
      {
        id: 'standard',
        title: 'Standard Delivery',
        fee: standardFee,
        currency: 'INR',
        estimatedDays: standardDays,
        estimatedDeliveryDate: calculateEstimatedDate(standardDays),
      },
      {
        id: 'express',
        title: 'Express Delivery',
        fee: expressFee,
        currency: 'INR',
        estimatedDays: expressDays,
        estimatedDeliveryDate: calculateEstimatedDate(expressDays),
      },
    ];

    return {
      pincode,
      isServiceable: true,
      city: loc.city,
      state: loc.state,
      isFreeShipping,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD_PAISE,
      codAvailable: true,
      rates,
      message: 'Shipping rates calculated successfully.',
    };
  }
}

export const shippingService = new ShippingService();
