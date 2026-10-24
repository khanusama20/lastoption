import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for login endpoint to mitigate brute-force credential stuffing.
 * Allows 10 attempts per 15-minute window per IP in production.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: {
      message: 'Too many login attempts from this IP address. Please try again after 15 minutes.',
    },
  },
});

/**
 * Reset rate limit counter for a specific IP.
 * Used for testing and administrative resets.
 */
export function resetLoginRateLimit(ip: string): void {
  if (typeof (loginRateLimiter as unknown as { resetKey: (k: string) => void }).resetKey === 'function') {
    (loginRateLimiter as unknown as { resetKey: (k: string) => void }).resetKey(ip);
  }
}
