import { IncomingMessage, ServerResponse } from 'http';
import pinoHttp, { HttpLogger, Options } from 'pino-http';
import crypto from 'crypto';
import { logger } from '../config/logger';
import { config } from '../config/env';

/**
 * Strict regex for validating incoming X-Request-Id.
 * Only allows alphanumeric characters, hyphens, and underscores up to 128 chars.
 * Prevents log injection, CRLF injection, and arbitrary untrusted payloads.
 */
export const SAFE_REQUEST_ID_REGEX = /^[a-zA-Z0-9_\-]{1,128}$/;

/**
 * Validates an incoming X-Request-Id header value.
 * If missing, invalid, containing whitespace/newlines, or exceeding 128 chars,
 * generates a fresh cryptographically safe UUID v4.
 */
export function generateOrValidateRequestId(headerVal?: string | string[]): string {
  if (typeof headerVal === 'string') {
    const trimmed = headerVal.trim();
    if (SAFE_REQUEST_ID_REGEX.test(trimmed)) {
      return trimmed;
    }
  }
  return crypto.randomUUID();
}

/**
 * Strips query strings from the URL to avoid logging sensitive query parameters.
 */
export function getSafeUrl(rawUrl?: string): string {
  return (rawUrl || '/').split('?')[0];
}

/**
 * Factory for HTTP request logging middleware using pino-http.
 */
export function createRequestLoggingMiddleware(customLogger = logger): HttpLogger {
  const options: Options = {
    logger: customLogger,
    genReqId: (req: IncomingMessage, res: ServerResponse) => {
      const incomingId = req.headers['x-request-id'];
      const reqId = generateOrValidateRequestId(incomingId);
      res.setHeader('X-Request-Id', reqId);
      return reqId;
    },
    serializers: {
      req: (req: any) => ({
        id: req.id,
        method: req.method,
        url: getSafeUrl(req.url),
        // Omit bodies, query parameters, and client IPs
      }),
      res: (res: any) => ({
        statusCode: res.statusCode,
      }),
      err: (err: any) => ({
        type: err.name || 'Error',
        message: err.message,
        ...(config.nodeEnv === 'development' && { stack: err.stack }),
      }),
    },
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req, res, responseTime) => {
      return `${req.method} ${getSafeUrl(req.url)} ${res.statusCode} (${responseTime}ms)`;
    },
    customErrorMessage: (req, res, err) => {
      return `${req.method} ${getSafeUrl(req.url)} ${res.statusCode} - ${err?.message || 'Error'}`;
    },
  };

  return pinoHttp(options);
}

export const requestLogger = createRequestLoggingMiddleware();
export default requestLogger;
