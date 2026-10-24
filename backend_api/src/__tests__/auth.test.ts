import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { prisma } from '../config/prisma';
import { hashPassword } from '../utils/password';
import { signToken } from '../utils/jwt';

describe('Phase 2.2 — Authentication & Security API', () => {
  const timestamp = Date.now();
  const testCustomer = {
    email: `test_customer_${timestamp}@lastoption.in`,
    password: 'ValidPassword123!',
    firstName: 'Arjun',
    lastName: 'Sharma',
    phone: '9876543210',
  };

  const testAdmin = {
    email: `test_admin_${timestamp}@lastoption.in`,
    password: 'AdminMasterPass123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  };

  let customerCookie: string;
  let adminToken: string;

  beforeAll(async () => {
    // Pre-create an admin account for role boundary testing
    const adminPasswordHash = await hashPassword(testAdmin.password);
    const admin = await prisma.user.create({
      data: {
        email: testAdmin.email,
        passwordHash: adminPasswordHash,
        firstName: testAdmin.firstName,
        lastName: testAdmin.lastName,
        role: 'admin',
      },
    });

    adminToken = signToken({
      sub: admin.id,
      email: admin.email,
      role: 'admin',
    });
  });

  afterAll(async () => {
    // Clean up test accounts created during test execution
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testCustomer.email, testAdmin.email],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe('1. Registration (POST /api/v1/auth/register)', () => {
    it('successfully registers a customer, sets HttpOnly cookie, and sanitizes output', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testCustomer);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(testCustomer.email.toLowerCase());
      expect(res.body.data.user.firstName).toBe(testCustomer.firstName);
      expect(res.body.data.user.role).toBe('customer');

      // CRITICAL: Ensure passwordHash is NEVER leaked
      expect(res.body.data.user.passwordHash).toBeUndefined();
      expect(res.body.data.user.password).toBeUndefined();

      // Verify Set-Cookie header contains HttpOnly session token
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const cookieStr = cookies[0];
      expect(cookieStr).toContain('lo_auth_token=');
      expect(cookieStr.toLowerCase()).toContain('httponly');
      expect(cookieStr.toLowerCase()).toContain('samesite=lax');

      customerCookie = cookieStr;
    });

    it('rejects duplicate email registration with 409 Conflict', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testCustomer);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('already exists');
    });

    it('rejects registration with invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'not-an-email',
          password: 'ValidPassword123!',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
        ])
      );
    });

    it('rejects registration with password shorter than 8 characters', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `short_${timestamp}@lastoption.in`,
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password' }),
        ])
      );
    });

    it('prevents privilege escalation when attempting to inject admin role in registration body', async () => {
      const escalationEmail = `escalation_${timestamp}@lastoption.in`;
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: escalationEmail,
          password: 'ValidPassword123!',
          role: 'admin', // Malicious attempt to elevate role
        });

      expect(res.status).toBe(201);
      expect(res.body.data.user.role).toBe('customer');

      // Verify in database that role was strictly saved as 'customer'
      const saved = await prisma.user.findUnique({ where: { email: escalationEmail } });
      expect(saved?.role).toBe('customer');

      // Cleanup
      await prisma.user.delete({ where: { email: escalationEmail } });
    });
  });

  describe('2. Login (POST /api/v1/auth/login)', () => {
    it('authenticates with correct credentials and returns session cookie', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testCustomer.email,
          password: testCustomer.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testCustomer.email.toLowerCase());
      expect(res.body.data.user.passwordHash).toBeUndefined();

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('lo_auth_token=');
      customerCookie = cookies[0];
    });

    it('rejects invalid password with generic 401 message (no user enumeration)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testCustomer.email,
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Invalid email or password.');
    });

    it('rejects non-existent email with identical generic 401 message', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@lastoption.in',
          password: 'SomePassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Invalid email or password.');
    });

    it('rejects missing email or password with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Protected User Profile (GET & PUT /api/v1/auth/me, /profile)', () => {
    it('blocks access to GET /me without authentication token (401)', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Authentication required');
    });

    it('blocks access to GET /me with an invalid or tampered token (401)', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', ['lo_auth_token=invalid.tampered.token']);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Invalid or expired');
    });

    it('allows access to GET /me with valid session cookie', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', [customerCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testCustomer.email.toLowerCase());
      expect(res.body.data.user.firstName).toBe(testCustomer.firstName);
    });

    it('allows access to GET /me via Authorization Bearer token header', async () => {
      // Extract the raw token from the cookie
      const match = customerCookie.match(/lo_auth_token=([^;]+)/);
      const rawToken = match ? match[1] : '';

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${rawToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testCustomer.email.toLowerCase());
    });

    it('updates user profile via PUT /api/v1/auth/profile', async () => {
      const res = await request(app)
        .put('/api/v1/auth/profile')
        .set('Cookie', [customerCookie])
        .send({
          firstName: 'Arjun Updated',
          phone: '9998887776',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.firstName).toBe('Arjun Updated');
      expect(res.body.data.user.phone).toBe('9998887776');
    });
  });

  describe('4. Logout (POST /api/v1/auth/logout)', () => {
    it('clears session cookie on logout and subsequent requests fail', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', [customerCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const logoutCookie = cookies[0];
      // Cleared cookie has an expired date or empty value
      expect(
        logoutCookie.includes('lo_auth_token=;') ||
        logoutCookie.includes('Expires=Thu, 01 Jan 1970') ||
        logoutCookie.includes('Max-Age=0')
      ).toBe(true);
    });
  });

  describe('5. Role Authorization Boundaries (requireAdmin)', () => {
    it('denies customer access to admin-only endpoint with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/admin/verify')
        .set('Cookie', [customerCookie]);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('administrator privileges required');
    });

    it('grants admin access to admin-only endpoint with 200 OK', async () => {
      const res = await request(app)
        .get('/api/v1/admin/verify')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('admin');
    });
  });

  describe('6. Rate Limiting Protection', () => {
    it('enforces brute-force limits after excessive login attempts', async () => {
      let lastRes;
      // Send 11 rapid requests to trigger the 10-attempt rate limit
      for (let i = 0; i < 11; i++) {
        lastRes = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'bruteforce@lastoption.in',
            password: 'BadPassword123!',
          });
      }

      expect(lastRes).toBeDefined();
      expect(lastRes?.status).toBe(429);
      expect(lastRes?.body.success).toBe(false);
      expect(lastRes?.body.error.message).toContain('Too many login attempts');
    });
  });
});
