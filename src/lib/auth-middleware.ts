// Autentikációs middleware helper
// Használható az API route-okban az autentikáció ellenőrzésére

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, TokenPayload, ADMIN_ROLES } from './auth';
import { UserRole } from '@/types/database';

export interface AuthResult {
  success: boolean;
  payload?: TokenPayload;
  error?: string;
  status?: number;
}

/**
 * Autentikáció ellenőrzése a requestből
 */
export async function checkAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return {
      success: false,
      error: 'Hiányzó autentikációs token',
      status: 401,
    };
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return {
      success: false,
      error: 'Érvénytelen vagy lejárt token',
      status: 401,
    };
  }

  return {
    success: true,
    payload,
  };
}

/**
 * Szerepkör alapú hozzáférés ellenőrzése
 */
export async function checkRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<AuthResult> {
  const authResult = await checkAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  if (!allowedRoles.includes(authResult.payload!.role)) {
    return {
      success: false,
      error: 'Nincs jogosultsága ehhez a művelethez',
      status: 403,
    };
  }

  return authResult;
}

/**
 * Admin hozzáférés ellenőrzése (admin, doctor, superadmin)
 */
export async function checkAdminAccess(request: NextRequest): Promise<AuthResult> {
  return checkRole(request, ADMIN_ROLES);
}

/**
 * Superadmin hozzáférés ellenőrzése
 */
export async function checkSuperadminAccess(request: NextRequest): Promise<AuthResult> {
  return checkRole(request, ['superadmin']);
}

/**
 * Error response generálása
 */
export function authErrorResponse(result: AuthResult): NextResponse {
  return NextResponse.json(
    { success: false, error: result.error },
    { status: result.status || 401 }
  );
}

/**
 * Wrapper függvény autentikált route-okhoz
 */
export function withAuth(
  handler: (request: NextRequest, payload: TokenPayload) => Promise<NextResponse>,
  allowedRoles?: UserRole[]
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = allowedRoles
      ? await checkRole(request, allowedRoles)
      : await checkAuth(request);

    if (!authResult.success) {
      return authErrorResponse(authResult);
    }

    return handler(request, authResult.payload!);
  };
}
