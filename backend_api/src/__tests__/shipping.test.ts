import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Phase 2.4 — Shipping & Courier Serviceability APIs', () => {
  describe('1. Pincode Serviceability Check (GET /api/v1/shipping/check-pincode)', () => {
    it('returns 200 with serviceability details for a metropolitan pincode (Bengaluru)', async () => {
      const res = await request(app).get('/api/v1/shipping/check-pincode?pincode=560001');

      expect(res.status).toBe(200);
      expect(res.headers['x-request-id']).toBeDefined();
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Pincode is serviceable for delivery');
      expect(res.body.data).toBeDefined();

      const data = res.body.data;
      expect(data.pincode).toBe('560001');
      expect(data.isServiceable).toBe(true);
      expect(data.city).toBe('Bengaluru');
      expect(data.state).toBe('Karnataka');
      expect(data.codAvailable).toBe(true);
      expect(data.courier).toBe('Delhivery Express');
      expect(typeof data.estimatedDays).toBe('number');
      expect(data.estimatedDays).toBe(2);
      expect(data.estimatedDeliveryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('returns 200 with serviceability details for New Delhi NCR', async () => {
      const res = await request(app).get('/api/v1/shipping/check-pincode?pincode=110001');

      expect(res.status).toBe(200);
      expect(res.body.data.isServiceable).toBe(true);
      expect(res.body.data.city).toBe('New Delhi');
      expect(res.body.data.state).toBe('Delhi');
      expect(res.body.data.estimatedDays).toBe(2);
    });

    it('returns 200 with serviceability details for Mumbai', async () => {
      const res = await request(app).get('/api/v1/shipping/check-pincode?pincode=400001');

      expect(res.status).toBe(200);
      expect(res.body.data.isServiceable).toBe(true);
      expect(res.body.data.city).toBe('Mumbai');
      expect(res.body.data.state).toBe('Maharashtra');
    });

    it('returns 200 with serviceability details for Tier 1 / Regional pincode (Pune)', async () => {
      const res = await request(app).get('/api/v1/shipping/check-pincode?pincode=411001');

      expect(res.status).toBe(200);
      expect(res.body.data.isServiceable).toBe(true);
      expect(res.body.data.city).toBe('Pune');
      expect(res.body.data.state).toBe('Maharashtra');
      expect(data => data.estimatedDays >= 2);
    });

    it('returns 200 with isServiceable=false for unserviceable / military postal code', async () => {
      const res = await request(app).get('/api/v1/shipping/check-pincode?pincode=999999');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.pincode).toBe('999999');
      expect(res.body.data.isServiceable).toBe(false);
      expect(res.body.data.city).toBeNull();
      expect(res.body.data.state).toBeNull();
      expect(res.body.data.estimatedDays).toBeNull();
      expect(res.body.data.estimatedDeliveryDate).toBeNull();
      expect(res.body.data.codAvailable).toBe(false);
      expect(res.body.data.courier).toBeNull();
    });

    it('returns 400 Bad Request when pincode parameter is missing', async () => {
      const res = await request(app).get('/api/v1/shipping/check-pincode');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Validation failed');
      expect(res.body.error.details.some((d: { field: string }) => d.field === 'pincode')).toBe(true);
    });

    it('returns 400 Bad Request when pincode contains letters or invalid characters', async () => {
      const res = await request(app).get('/api/v1/shipping/check-pincode?pincode=56000A');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.details.some((d: { field: string }) => d.field === 'pincode')).toBe(true);
    });

    it('returns 400 Bad Request when pincode is not exactly 6 digits', async () => {
      const resShort = await request(app).get('/api/v1/shipping/check-pincode?pincode=56000');
      expect(resShort.status).toBe(400);

      const resLong = await request(app).get('/api/v1/shipping/check-pincode?pincode=5600001');
      expect(resLong.status).toBe(400);
    });

    it('returns 400 Bad Request when pincode starts with 0', async () => {
      const res = await request(app).get('/api/v1/shipping/check-pincode?pincode=012345');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.details.some((d: { field: string }) => d.field === 'pincode')).toBe(true);
    });
  });

  describe('2. Shipping Rate Calculation (POST /api/v1/shipping/calculate-rates)', () => {
    it('calculates standard and express rates for serviceable pincode when subtotal is under free shipping threshold', async () => {
      const res = await request(app).post('/api/v1/shipping/calculate-rates').send({
        pincode: '560001',
        weightGrams: 1000,
        subtotal: 149900, // ₹1,499 (< ₹2,999)
      });

      expect(res.status).toBe(200);
      expect(res.headers['x-request-id']).toBeDefined();
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Shipping rates calculated successfully');

      const data = res.body.data;
      expect(data.pincode).toBe('560001');
      expect(data.isServiceable).toBe(true);
      expect(data.city).toBe('Bengaluru');
      expect(data.state).toBe('Karnataka');
      expect(data.isFreeShipping).toBe(false);
      expect(data.freeShippingThreshold).toBe(299900);
      expect(data.codAvailable).toBe(true);
      expect(data.rates).toHaveLength(2);

      const standard = data.rates.find((r: { id: string }) => r.id === 'standard');
      expect(standard).toBeDefined();
      expect(standard.title).toBe('Standard Delivery');
      expect(standard.fee).toBe(9900); // ₹99 base
      expect(standard.currency).toBe('INR');
      expect(typeof standard.estimatedDays).toBe('number');
      expect(standard.estimatedDeliveryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      const express = data.rates.find((r: { id: string }) => r.id === 'express');
      expect(express).toBeDefined();
      expect(express.title).toBe('Express Delivery');
      expect(express.fee).toBe(19900); // ₹199 base
      expect(express.currency).toBe('INR');
      expect(express.estimatedDays).toBeLessThanOrEqual(standard.estimatedDays);
    });

    it('applies free shipping (fee = 0) on orders over ₹2,999 (299900 paise)', async () => {
      const res = await request(app).post('/api/v1/shipping/calculate-rates').send({
        pincode: '560001',
        weightGrams: 1500,
        subtotal: 499900, // ₹4,999 (> ₹2,999)
      });

      expect(res.status).toBe(200);
      const data = res.body.data;
      expect(data.isFreeShipping).toBe(true);

      const standard = data.rates.find((r: { id: string }) => r.id === 'standard');
      expect(standard.fee).toBe(0);

      const express = data.rates.find((r: { id: string }) => r.id === 'express');
      expect(express.fee).toBe(0); // Free Express Shipping nationwide
    });

    it('applies free shipping exactly at the ₹2,999 threshold (299900 paise)', async () => {
      const res = await request(app).post('/api/v1/shipping/calculate-rates').send({
        pincode: '110001',
        weightGrams: 1000,
        subtotal: 299900, // Exactly ₹2,999
      });

      expect(res.status).toBe(200);
      expect(res.body.data.isFreeShipping).toBe(true);
      expect(res.body.data.rates[0].fee).toBe(0);
      expect(res.body.data.rates[1].fee).toBe(0);
    });

    it('scales shipping rates proportionally for parcels heavier than 1000g when below free threshold', async () => {
      // 2200g = 1000g base + 1200g extra = 3 additional 500g slabs
      const res = await request(app).post('/api/v1/shipping/calculate-rates').send({
        pincode: '560001',
        weightGrams: 2200,
        subtotal: 200000, // ₹2,000 (< ₹2,999)
      });

      expect(res.status).toBe(200);
      const data = res.body.data;
      expect(data.isFreeShipping).toBe(false);

      const standard = data.rates.find((r: { id: string }) => r.id === 'standard');
      // 9900 base + (3 * 5000) = 24900 paise (₹249)
      expect(standard.fee).toBe(24900);

      const express = data.rates.find((r: { id: string }) => r.id === 'express');
      // 19900 base + (3 * 8000) = 43900 paise (₹439)
      expect(express.fee).toBe(43900);
    });

    it('returns isServiceable=false and empty rates for unserviceable destination pincode', async () => {
      const res = await request(app).post('/api/v1/shipping/calculate-rates').send({
        pincode: '999999',
        weightGrams: 1000,
        subtotal: 150000,
      });

      expect(res.status).toBe(200);
      expect(res.body.data.isServiceable).toBe(false);
      expect(res.body.data.rates).toHaveLength(0);
      expect(res.body.data.codAvailable).toBe(false);
    });

    it('returns 400 Bad Request when pincode in body is invalid', async () => {
      const res = await request(app).post('/api/v1/shipping/calculate-rates').send({
        pincode: 'INVALID',
        weightGrams: 1000,
        subtotal: 50000,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Validation failed');
      expect(res.body.error.details.some((d: { field: string }) => d.field === 'pincode')).toBe(true);
    });

    it('returns 400 Bad Request when weight is zero or negative', async () => {
      const res = await request(app).post('/api/v1/shipping/calculate-rates').send({
        pincode: '560001',
        weightGrams: 0,
        subtotal: 50000,
      });

      expect(res.status).toBe(400);
      expect(res.body.error.details.some((d: { field: string }) => d.field === 'weightGrams')).toBe(true);
    });

    it('returns 400 Bad Request when subtotal is negative', async () => {
      const res = await request(app).post('/api/v1/shipping/calculate-rates').send({
        pincode: '560001',
        weightGrams: 1000,
        subtotal: -500,
      });

      expect(res.status).toBe(400);
      expect(res.body.error.details.some((d: { field: string }) => d.field === 'subtotal')).toBe(true);
    });
  });
});
