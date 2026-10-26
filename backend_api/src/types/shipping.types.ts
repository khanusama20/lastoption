export interface PincodeServiceabilityResponse {
  pincode: string;
  isServiceable: boolean;
  city: string | null;
  state: string | null;
  district?: string | null;
  estimatedDays: number | null;
  estimatedDeliveryDate: string | null;
  codAvailable: boolean;
  courier: string | null;
  message?: string;
}

export interface ShippingRateOption {
  id: 'standard' | 'express';
  title: string;
  fee: number; // in paise (e.g. 9900 = ₹99, 0 = Free)
  currency: 'INR';
  estimatedDays: number;
  estimatedDeliveryDate: string;
}

export interface CalculateRatesResponse {
  pincode: string;
  isServiceable: boolean;
  city: string | null;
  state: string | null;
  isFreeShipping: boolean;
  freeShippingThreshold: number; // in paise (299900 = ₹2,999)
  codAvailable: boolean;
  rates: ShippingRateOption[];
  message?: string;
}
