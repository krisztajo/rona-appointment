// Autentikációs segédfüggvények
// JWT kezelés, jelszó hash, validáció

import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';
import { UserPublic, UserRole } from '@/types/database';

// JWT titkos kulcs - éles környezetben környezeti változóból kell jönnie
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'rona-rendelo-secret-key-change-in-production-2026'
);

// JWT lejárati idő (24 óra)
const JWT_EXPIRATION = '24h';

// Jelszó hash költség (bcrypt rounds)
const BCRYPT_ROUNDS = 10;

// Sikertelen bejelentkezési kísérlet limit
export const MAX_FAILED_ATTEMPTS = 5;

// Fiók zárolási idő (percekben)
export const LOCKOUT_DURATION_MINUTES = 15;

// ============================================
// JWT Token kezelés
// ============================================

export interface TokenPayload extends JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
  doctor_id: number | null;
}

/**
 * JWT token generálása
 */
export async function generateToken(user: UserPublic): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    doctor_id: user.doctor_id,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}

/**
 * JWT token ellenőrzése és dekódolása
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Token kinyerése a request headerből
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  // Bearer token formátum
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

// ============================================
// Jelszó kezelés
// ============================================

/**
 * Jelszó hashelése bcrypt-tel
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Jelszó ellenőrzése
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================
// Jelszó validáció
// ============================================

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Jelszó erősség ellenőrzése
 * Követelmények:
 * - Minimum 8 karakter
 * - Legalább egy nagybetű
 * - Legalább egy kisbetű
 * - Legalább egy szám
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('A jelszónak legalább 8 karakter hosszúnak kell lennie');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('A jelszónak tartalmaznia kell legalább egy nagybetűt');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('A jelszónak tartalmaznia kell legalább egy kisbetűt');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('A jelszónak tartalmaznia kell legalább egy számot');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================
// Email validáció
// ============================================

/**
 * Email formátum ellenőrzése
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// Szerepkör ellenőrzések
// ============================================

/**
 * Admin szerepkörök (admin oldalhoz férhetnek hozzá)
 */
export const ADMIN_ROLES: UserRole[] = ['admin', 'doctor', 'superadmin'];

/**
 * Ellenőrzi, hogy a felhasználó admin szerepkörű-e
 */
export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

/**
 * Ellenőrzi, hogy a felhasználónak van-e jogosultsága egy adott szerepkörhöz
 */
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    user: 0,
    doctor: 1,
    admin: 2,
    superadmin: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// ============================================
// Fiók zárolás kezelés
// ============================================

/**
 * Ellenőrzi, hogy a fiók zárolva van-e
 */
export function isAccountLocked(lockedUntil: string | null): boolean {
  if (!lockedUntil) return false;
  
  const lockTime = new Date(lockedUntil);
  return lockTime > new Date();
}

/**
 * Zárolás lejárati idő számítása
 */
export function calculateLockoutTime(): string {
  const lockUntil = new Date();
  lockUntil.setMinutes(lockUntil.getMinutes() + LOCKOUT_DURATION_MINUTES);
  return lockUntil.toISOString();
}
