import { User } from '@prisma/client';
import { prisma } from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { HttpError } from '../utils/errors';
import { RegisterDTO, LoginDTO, UpdateProfileDTO, UserResponse } from '../types/auth.types';

function sanitizeUser(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class AuthService {
  /**
   * Register a new customer account.
   * Enforces role = 'customer' and prevents duplicate email registration.
   */
  async register(dto: RegisterDTO): Promise<{ user: UserResponse; token: string }> {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new HttpError(409, 'An account with this email address already exists.');
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName?.trim() || null,
        lastName: dto.lastName?.trim() || null,
        phone: dto.phone?.trim() || null,
        role: 'customer',
      },
    });

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { user: sanitizeUser(user), token };
  }

  /**
   * Authenticate customer or admin with email and password.
   * Uses uniform error messages to prevent account enumeration.
   */
  async login(dto: LoginDTO): Promise<{ user: UserResponse; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new HttpError(401, 'Invalid email or password.');
    }

    const isPasswordValid = await comparePassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid email or password.');
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { user: sanitizeUser(user), token };
  }

  /**
   * Fetch current user profile by user ID.
   */
  async getProfile(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpError(404, 'User account not found.');
    }

    return sanitizeUser(user);
  }

  /**
   * Update editable profile fields (name, phone).
   */
  async updateProfile(userId: string, dto: UpdateProfileDTO): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpError(404, 'User account not found.');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName.trim() || null }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName.trim() || null }),
        ...(dto.phone !== undefined && { phone: dto.phone.trim() || null }),
      },
    });

    return sanitizeUser(updated);
  }
}

export const authService = new AuthService();
