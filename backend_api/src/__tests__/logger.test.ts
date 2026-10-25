import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express, { Request, Response } from 'express';
import {
  generateOrValidateRequestId,
  getSafeUrl,
  createRequestLoggingMiddleware,
  SAFE_REQUEST_ID_REGEX,
} from '../middleware/requestLogger';
import { createLogger, SENSITIVE_REDACTION_PATHS } from '../config/logger';
import { errorHandler, AppError } from '../middleware/errorHandler';
import { config } from '../config/env';
import app from '../app';

describe('Pino Structured Logging & Request ID Prerequisite', () => {
  describe('1. Request ID Generation and Validation', () => {
    it('accepts safe, valid incoming X-Request-Id values', () => {
      const validIds = [
        'req-12345',
        'trace_id_abcdef',
        'c29a8a79-56bf-4e78-9e1e-fb933eb96ad1',
        'USER-REQUEST-001',
      ];

      for (const id of validIds) {
        expect(generateOrValidateRequestId(id)).toBe(id);
      }
    });

    it('rejects missing or invalid X-Request-Id and generates a fresh UUID', () => {
      const invalidInputs = [
        undefined,
        '',
        '   ',
        'has spaces in id',
        'evil\r\nX-Injected: true',
        '<script>alert(1)</script>',
        'id/with/slashes',
        'a'.repeat(129), // Exceeds 128 characters
      ];

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      for (const input of invalidInputs) {
        const generated = generateOrValidateRequestId(input as any);
        expect(generated).toMatch(uuidRegex);
        expect(generated).not.toBe(input);
      }
    });

    it('matches the strict SAFE_REQUEST_ID_REGEX pattern', () => {
      expect(SAFE_REQUEST_ID_REGEX.test('valid-id_123')).toBe(true);
      expect(SAFE_REQUEST_ID_REGEX.test('invalid id')).toBe(false);
      expect(SAFE_REQUEST_ID_REGEX.test('invalid\nid')).toBe(false);
      expect(SAFE_REQUEST_ID_REGEX.test('')).toBe(false);
    });
  });

  describe('2. Safe URL Extraction (Query Stripping)', () => {
    it('strips query parameters from requested URLs to prevent logging sensitive query values', () => {
      expect(getSafeUrl('/api/v1/products?search=bomber&token=secret123')).toBe('/api/v1/products');
      expect(getSafeUrl('/auth/login?redirect=%2Faccount')).toBe('/auth/login');
      expect(getSafeUrl('/health')).toBe('/health');
      expect(getSafeUrl(undefined)).toBe('/');
    });
  });

  describe('3. Sensitive Data Redaction', () => {
    it('redacts sensitive headers, tokens, passwords, and OTPs in logs', () => {
      let logOutput = '';
      const memoryStream = {
        write(chunk: string) {
          logOutput += chunk;
        },
      };

      const testLogger = createLogger({ level: 'info' }, memoryStream as any);

      // Log an object containing sensitive properties
      testLogger.info({
        req: {
          headers: {
            authorization: 'Bearer super_secret_jwt_token',
            cookie: 'lo_auth_token=confidential_session_cookie',
          },
        },
        user: {
          email: 'customer@lastoption.in',
          password: 'plain_password_123',
          passwordHash: '$2a$12$e8O09...',
        },
        auth: {
          token: 'token_xyz_999',
          otp: '4892',
          secret: 'internal_api_secret',
        },
      }, 'User action logged');

      expect(logOutput).toContain('[REDACTED]');
      expect(logOutput).not.toContain('super_secret_jwt_token');
      expect(logOutput).not.toContain('confidential_session_cookie');
      expect(logOutput).not.toContain('plain_password_123');
      expect(logOutput).not.toContain('token_xyz_999');
      expect(logOutput).not.toContain('4892');
      expect(logOutput).not.toContain('internal_api_secret');
      expect(logOutput).toContain('customer@lastoption.in'); // Non-sensitive email preserved
    });

    it('includes all required redaction paths in configuration', () => {
      expect(SENSITIVE_REDACTION_PATHS).toContain('req.headers.authorization');
      expect(SENSITIVE_REDACTION_PATHS).toContain('req.headers.cookie');
      expect(SENSITIVE_REDACTION_PATHS).toContain('*.password');
      expect(SENSITIVE_REDACTION_PATHS).toContain('*.token');
      expect(SENSITIVE_REDACTION_PATHS).toContain('*.otp');
      expect(SENSITIVE_REDACTION_PATHS).toContain('*.secret');
    });
  });

  describe('4. Request Logger Middleware with Express', () => {
    it('attaches X-Request-Id header to incoming requests and outgoing responses', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.status).toBe(200);
      expect(res.headers['x-request-id']).toBeDefined();
      expect(res.headers['x-request-id']).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it('preserves valid client-provided X-Request-Id', async () => {
      const clientReqId = 'custom-client-trace-98765';
      const res = await request(app)
        .get('/api/v1/health')
        .set('X-Request-Id', clientReqId);

      expect(res.status).toBe(200);
      expect(res.headers['x-request-id']).toBe(clientReqId);
    });

    it('replaces dangerous client-provided X-Request-Id with safe UUID', async () => {
      const dangerousId = 'bad id with spaces';
      const res = await request(app)
        .get('/api/v1/health')
        .set('X-Request-Id', dangerousId);

      expect(res.status).toBe(200);
      expect(res.headers['x-request-id']).not.toBe(dangerousId);
      expect(res.headers['x-request-id']).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it('records request completion with method, path, and duration without bodies or IPs', async () => {
      let recordedLogs: any[] = [];
      const memoryStream = {
        write(chunk: string) {
          try {
            recordedLogs.push(JSON.parse(chunk));
          } catch {
            // Ignore non-json
          }
        },
      };

      const testLogger = createLogger({ level: 'info' }, memoryStream as any);
      const testApp = express();
      testApp.use(createRequestLoggingMiddleware(testLogger));
      testApp.get('/test-route', (_req, res) => {
        res.status(200).json({ success: true });
      });

      await request(testApp).get('/test-route?sensitive_param=leak');

      expect(recordedLogs.length).toBeGreaterThan(0);
      const reqLog = recordedLogs.find((l) => l.req?.url === '/test-route');
      expect(reqLog).toBeDefined();
      expect(reqLog.req.method).toBe('GET');
      expect(reqLog.req.url).toBe('/test-route'); // Query parameter stripped
      expect(reqLog.req.body).toBeUndefined(); // Body not serialized
      expect(reqLog.req.remoteAddress).toBeUndefined(); // Client IP not logged
      expect(reqLog.req.ip).toBeUndefined();
      expect(reqLog.res.statusCode).toBe(200);
      expect(reqLog.responseTime).toBeDefined();
      expect(typeof reqLog.responseTime).toBe('number');
    });
  });

  describe('5. Production vs Development Error Handling & Stack Traces', () => {
    it('masks internal server 5xx errors and omits stack trace in production', async () => {
      const errorApp = express();
      // Temporarily mock config.isProduction to true
      const originalIsProd = config.isProduction;
      (config as { isProduction: boolean }).isProduction = true;

      try {
        errorApp.get('/fault', () => {
          const err = new Error('Database connection failed: secret credentials at /var/secret');
          (err as AppError).statusCode = 500;
          throw err;
        });
        errorApp.use(errorHandler);

        const res = await request(errorApp).get('/fault');

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.error.message).toBe(
          'An unexpected internal server error occurred. Please try again later.'
        );
        expect(res.body.error.stack).toBeUndefined();
        expect(JSON.stringify(res.body)).not.toContain('/var/secret');
      } finally {
        (config as { isProduction: boolean }).isProduction = originalIsProd;
      }
    });

    it('returns field-level validation details for 400 client errors', async () => {
      const errorApp = express();
      errorApp.get('/bad-input', () => {
        const err = new Error('Validation error');
        (err as AppError).statusCode = 400;
        (err as AppError).details = [{ field: 'email', message: 'Invalid email format' }];
        throw err;
      });
      errorApp.use(errorHandler);

      const res = await request(errorApp).get('/bad-input');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Validation error');
      expect(res.body.error.details).toEqual([
        { field: 'email', message: 'Invalid email format' },
      ]);
    });
  });
});
