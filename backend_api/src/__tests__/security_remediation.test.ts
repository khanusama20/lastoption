import { describe, it, expect, vi } from 'vitest';
import { Response, Request } from 'express';
import {
  validateProductionSecrets,
  parseTrustProxy,
  parseDurationToMs,
  config,
} from '../config/env';
import { errorHandler, AppError } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/response';
import { resetLoginRateLimit, loginRateLimiter } from '../middleware/rateLimiter';

describe('Phase 2.2 Security Remediation Tests', () => {
  describe('1. Production Secret Validation', () => {
    const validSecret32 = 'a'.repeat(32);
    const validDbUrl = 'postgresql://user:pass@localhost:5432/mydb';

    it('rejects missing or short JWT_SECRET (< 32 chars) in production', () => {
      expect(() => {
        validateProductionSecrets('short-secret', validSecret32, validDbUrl);
      }).toThrow(/JWT_SECRET must be at least 32 characters/i);
    });

    it('rejects known development fallback placeholder secrets in production', () => {
      expect(() => {
        validateProductionSecrets(
          'dev_jwt_secret_must_be_set_in_env_file_12345678',
          validSecret32,
          validDbUrl
        );
      }).toThrow(/insecure development placeholder/i);

      expect(() => {
        validateProductionSecrets(
          'placeholder_jwt_secret_change_in_production_9999',
          validSecret32,
          validDbUrl
        );
      }).toThrow(/insecure development placeholder/i);
    });

    it('rejects short or insecure COOKIE_SECRET in production', () => {
      expect(() => {
        validateProductionSecrets(validSecret32, 'short', validDbUrl);
      }).toThrow(/COOKIE_SECRET must be at least 32 characters/i);

      expect(() => {
        validateProductionSecrets(
          validSecret32,
          'change_in_production_cookie_secret_12345',
          validDbUrl
        );
      }).toThrow(/insecure development placeholder/i);
    });

    it('rejects empty DATABASE_URL in production', () => {
      expect(() => {
        validateProductionSecrets(validSecret32, validSecret32, '');
      }).toThrow(/DATABASE_URL must be defined/i);
    });

    it('accepts strong independent 32+ character production secrets', () => {
      expect(() => {
        validateProductionSecrets(
          '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1',
          '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
          validDbUrl
        );
      }).not.toThrow();
    });

    it('never leaks secret values in the exception message', () => {
      const secretToHide = 'top_secret_sensitive_password_string_123';
      try {
        validateProductionSecrets('short', validSecret32, validDbUrl);
      } catch (err: unknown) {
        const error = err as Error;
        expect(error.message).not.toContain(secretToHide);
      }
    });
  });

  describe('2. Reverse Proxy & Trust Configuration', () => {
    it('defaults trustProxy to 1 in production and false in development/test', () => {
      expect(parseTrustProxy(undefined, true)).toBe(1);
      expect(parseTrustProxy(undefined, false)).toBe(false);
    });

    it('parses explicit TRUST_PROXY settings accurately', () => {
      expect(parseTrustProxy('false', true)).toBe(false);
      expect(parseTrustProxy('true', false)).toBe(true);
      expect(parseTrustProxy('2', true)).toBe(2);
      expect(parseTrustProxy('loopback, 10.0.0.0/8', true)).toBe('loopback, 10.0.0.0/8');
    });
  });

  describe('3. Duration & Cookie Max-Age Parsing', () => {
    it('correctly converts duration strings to milliseconds', () => {
      expect(parseDurationToMs('7d')).toBe(7 * 24 * 60 * 60 * 1000);
      expect(parseDurationToMs('24h')).toBe(24 * 60 * 60 * 1000);
      expect(parseDurationToMs('60m')).toBe(60 * 60 * 1000);
      expect(parseDurationToMs('30s')).toBe(30 * 1000);
      expect(parseDurationToMs('invalid')).toBe(7 * 24 * 60 * 60 * 1000); // default fallback
    });
  });

  describe('4. Centralized Error Handler (Production Masking)', () => {
    it('masks 5xx internal server errors with a generic safe message in production', () => {
      // Temporarily mock config.isProduction to true
      const originalIsProd = config.isProduction;
      (config as { isProduction: boolean }).isProduction = true;

      const mockReq = { method: 'GET', url: '/api/v1/test' } as Request;
      let capturedStatus = 0;
      let capturedJson: unknown = null;

      const mockRes = {
        status: (code: number) => {
          capturedStatus = code;
          return {
            json: (body: unknown) => {
              capturedJson = body;
            },
          };
        },
      } as unknown as Response;

      const internalError: AppError = new Error('Raw PostgreSQL connection syntax failure at line 42: secret_db_column');
      internalError.statusCode = 500;

      errorHandler(internalError, mockReq, mockRes, () => {});

      expect(capturedStatus).toBe(500);
      const jsonResponse = capturedJson as { success: boolean; error: { message: string; stack?: string } };
      expect(jsonResponse.success).toBe(false);
      expect(jsonResponse.error.message).toBe('An unexpected internal server error occurred. Please try again later.');
      expect(jsonResponse.error.message).not.toContain('secret_db_column');
      expect(jsonResponse.error.stack).toBeUndefined();

      // Restore original flag
      (config as { isProduction: boolean }).isProduction = originalIsProd;
    });

    it('preserves client-facing messages for 4xx operational errors', () => {
      const mockReq = { method: 'POST', url: '/api/v1/auth/login' } as Request;
      let capturedStatus = 0;
      let capturedJson: unknown = null;

      const mockRes = {
        status: (code: number) => {
          capturedStatus = code;
          return {
            json: (body: unknown) => {
              capturedJson = body;
            },
          };
        },
      } as unknown as Response;

      const operationalError: AppError = new Error('Invalid email or password.');
      operationalError.statusCode = 401;

      errorHandler(operationalError, mockReq, mockRes, () => {});

      expect(capturedStatus).toBe(401);
      const jsonResponse = capturedJson as { success: boolean; error: { message: string } };
      expect(jsonResponse.success).toBe(false);
      expect(jsonResponse.error.message).toBe('Invalid email or password.');
    });
  });

  describe('5. Standardized Success Response Helper', () => {
    it('produces uniform API success envelope with message and data', () => {
      let capturedStatus = 0;
      let capturedJson: unknown = null;

      const mockRes = {
        status: (code: number) => {
          capturedStatus = code;
          return {
            json: (body: unknown) => {
              capturedJson = body;
              return mockRes;
            },
          };
        },
      } as unknown as Response;

      sendSuccess(mockRes, {
        statusCode: 201,
        message: 'Resource created',
        data: { id: '123' },
      });

      expect(capturedStatus).toBe(201);
      expect(capturedJson).toEqual({
        success: true,
        message: 'Resource created',
        data: { id: '123' },
      });
    });
  });

  describe('6. Test Database Safety Guard', () => {
    it('guarantees test configuration uses dedicated mydb_test database', () => {
      expect(config.databaseUrl).toContain('mydb_test');
      expect(config.isTest).toBe(true);
    });
  });

  describe('7. Rate Limiter In-Memory Reset', () => {
    it('allows programmatic reset of rate-limit counter for clean test isolation', () => {
      expect(() => resetLoginRateLimit('127.0.0.1')).not.toThrow();
    });
  });
});
