import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { JwtPayload } from '../types/auth.types';

/**
 * Sign a JWT token containing user identity and role.
 */
export function signToken(payload: { sub: string; email: string; role: string }): string {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwtSecret, options);
}

/**
 * Verify and decode a JWT token.
 * Throws an error if invalid, tampered, or expired.
 */
export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, config.jwtSecret);
  return decoded as JwtPayload;
}
