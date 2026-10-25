import pino, { Logger, LoggerOptions, DestinationStream } from 'pino';
import { config } from './env';

/**
 * Sensitive fields and headers that must never appear in cleartext logs.
 * Pino will censor any matching keys with '[REDACTED]'.
 */
export const SENSITIVE_REDACTION_PATHS: string[] = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["set-cookie"]',
  'req.headers["x-auth-token"]',
  'headers.authorization',
  'headers.cookie',
  'headers["set-cookie"]',
  'headers["x-auth-token"]',
  '*.password',
  '*.passwordHash',
  '*.token',
  '*.refreshToken',
  '*.accessToken',
  '*.otp',
  '*.secret',
  '*.jwtSecret',
  '*.cookieSecret',
  '*.cardNumber',
  '*.cvv',
  '*.cvc',
];

/**
 * Create a configured Pino logger instance.
 * - Development: Formatted colorized output via pino-pretty.
 * - Production: High-performance structured single-line JSON to stdout (12-factor cloud).
 * - Test: Configurable log level (defaults to 'silent') with optional memory stream destination for assertions.
 */
export function createLogger(
  options: LoggerOptions = {},
  destination?: DestinationStream
): Logger {
  const isDev = config.nodeEnv === 'development';

  let transport: LoggerOptions['transport'] = undefined;

  if (isDev && !destination) {
    try {
      transport = {
        target: require.resolve('pino-pretty'),
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      };
    } catch {
      // Fallback gracefully to raw stream if pino-pretty is unavailable
      transport = undefined;
    }
  }

  const defaultOptions: LoggerOptions = {
    level: options.level || config.logLevel,
    redact: {
      paths: SENSITIVE_REDACTION_PATHS,
      censor: '[REDACTED]',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(transport ? { transport } : {}),
    ...options,
  };

  return destination ? pino(defaultOptions, destination) : pino(defaultOptions);
}

export const logger = createLogger();
export default logger;
