import { Response, CookieOptions } from 'express';
import { config } from '../config/env';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: 'lax',
  maxAge: SEVEN_DAYS_MS,
  path: '/',
};

/**
 * Attach the signed authentication JWT inside a secure HttpOnly cookie.
 */
export function setAuthCookie(res: Response, token: string): void {
  res.cookie(config.cookieName, token, authCookieOptions);
}

/**
 * Clear the authentication cookie upon logout.
 */
export function clearAuthCookie(res: Response): void {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
    path: '/',
  });
}
