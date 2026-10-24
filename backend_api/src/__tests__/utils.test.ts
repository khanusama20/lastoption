import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken, verifyToken } from '../utils/jwt';

describe('Password & Security Utilities', () => {
  it('hashes password securely and verifies match', async () => {
    const plain = 'SecurePassword123!';
    const hash = await hashPassword(plain);

    expect(hash).not.toBe(plain);
    expect(hash).toMatch(/^\$2[ab]\$/); // bcrypt format

    const isMatch = await comparePassword(plain, hash);
    expect(isMatch).toBe(true);

    const isMismatch = await comparePassword('WrongPassword', hash);
    expect(isMismatch).toBe(false);
  });

  it('signs and verifies JWT tokens', () => {
    const payload = {
      sub: 'usr-1234-uuid',
      email: 'customer@lastoption.in',
      role: 'customer',
    };

    const token = signToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT 3-part structure

    const decoded = verifyToken(token);
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('throws error for tampered token', () => {
    const token = signToken({ sub: '1', email: 'test@example.com', role: 'customer' });
    const tampered = token.slice(0, -5) + 'xxxxx';

    expect(() => verifyToken(tampered)).toThrow();
  });
});
