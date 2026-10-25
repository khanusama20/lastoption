import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const isTest = nodeEnv === 'test';

const FORBIDDEN_DEV_SECRETS = [
  'dev_jwt_secret',
  'placeholder_jwt',
  'change_in_production',
  'secret',
  'password',
];

/**
 * Validate security-critical secrets in production environments.
 * Throws a fatal exception without printing secret values to logs or console.
 */
export function validateProductionSecrets(
  jwtSecret: string,
  cookieSecret: string,
  databaseUrl: string
): void {
  if (!databaseUrl) {
    throw new Error('FATAL: DATABASE_URL must be defined.');
  }

  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be at least 32 characters long in production.');
  }

  const isJwtInsecure = FORBIDDEN_DEV_SECRETS.some((forbidden) =>
    jwtSecret.toLowerCase().includes(forbidden)
  );
  if (isJwtInsecure) {
    throw new Error('FATAL: JWT_SECRET is set to an insecure development placeholder in production.');
  }

  if (!cookieSecret || cookieSecret.length < 32) {
    throw new Error('FATAL: COOKIE_SECRET must be at least 32 characters long in production.');
  }

  const isCookieInsecure = FORBIDDEN_DEV_SECRETS.some((forbidden) =>
    cookieSecret.toLowerCase().includes(forbidden)
  );
  if (isCookieInsecure) {
    throw new Error('FATAL: COOKIE_SECRET is set to an insecure development placeholder in production.');
  }
}

/**
 * Parse reverse-proxy trust settings.
 * Defaults to 1 (trusting 1 reverse-proxy hop) in production, false in development/test.
 * Can be explicitly overridden via TRUST_PROXY environment variable.
 */
export function parseTrustProxy(
  rawSetting: string | undefined,
  inProduction: boolean
): boolean | number | string {
  if (!rawSetting) {
    return inProduction ? 1 : false;
  }

  const lower = rawSetting.trim().toLowerCase();
  if (lower === 'false') return false;
  if (lower === 'true') return true;

  const numeric = parseInt(rawSetting, 10);
  if (!isNaN(numeric) && numeric >= 0) return numeric;

  return rawSetting.trim();
}

/**
 * Convert human-readable duration strings (e.g. '7d', '24h', '60m') to milliseconds.
 */
export function parseDurationToMs(duration: string): number {
  const match = duration.match(/^(\d+)\s*([dhms])?$/i);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000; // Default 7 days
  }

  const value = parseInt(match[1], 10);
  const unit = (match[2] || 'd').toLowerCase();

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
    default:
      return value * 24 * 60 * 60 * 1000;
  }
}

const rawDatabaseUrl = process.env.DATABASE_URL || '';
const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ||
  (rawDatabaseUrl ? rawDatabaseUrl.replace(/\/mydb(\?|$)/, '/mydb_test$1') : '');

// In test environment, enforce the dedicated test database
const activeDatabaseUrl = isTest ? testDatabaseUrl : rawDatabaseUrl;

const jwtSecret =
  process.env.JWT_SECRET || (isProduction ? '' : 'dev_jwt_secret_must_be_set_in_env_file');
const cookieSecret =
  process.env.COOKIE_SECRET || (isProduction ? '' : 'dev_cookie_secret_must_be_set_in_env_file');

// Enforce production security check on load if running in production
if (isProduction) {
  validateProductionSecrets(jwtSecret, cookieSecret, activeDatabaseUrl);
}

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
const logLevel = process.env.LOG_LEVEL || (isTest ? 'silent' : isProduction ? 'info' : 'debug');

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  isProduction,
  isTest,
  logLevel,
  databaseUrl: activeDatabaseUrl,
  jwtSecret,
  cookieSecret,
  jwtExpiresIn,
  cookieMaxAgeMs: parseDurationToMs(jwtExpiresIn),
  cookieName: process.env.COOKIE_NAME || 'lo_auth_token',
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY, isProduction),
};
