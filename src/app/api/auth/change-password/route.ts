// Jelszó változtatás API végpont
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { 
  verifyToken, 
  extractTokenFromHeader,
  verifyPassword,
  hashPassword,
  validatePassword 
} from '@/lib/auth';
import { User, ChangePasswordRequest } from '@/types/database';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Token ellenőrzés
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Hiányzó autentikációs token' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Érvénytelen vagy lejárt token' },
        { status: 401 }
      );
    }

    const body: ChangePasswordRequest = await request.json();
    const { current_password, new_password } = body;

    // Validáció
    if (!current_password || !new_password) {
      return NextResponse.json(
        { success: false, error: 'Minden mező kitöltése kötelező' },
        { status: 400 }
      );
    }

    // Új jelszó erősség ellenőrzés
    const passwordValidation = validatePassword(new_password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.errors.join('. ') },
        { status: 400 }
      );
    }

    const db = getDB();

    // Felhasználó lekérése
    const user = await db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(payload.userId)
      .first<User>();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Felhasználó nem található' },
        { status: 404 }
      );
    }

    // Jelenlegi jelszó ellenőrzése
    const isCurrentPasswordValid = await verifyPassword(current_password, user.password_hash);

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'A jelenlegi jelszó hibás' },
        { status: 401 }
      );
    }

    // Új jelszó nem lehet ugyanaz
    const isSamePassword = await verifyPassword(new_password, user.password_hash);
    if (isSamePassword) {
      return NextResponse.json(
        { success: false, error: 'Az új jelszó nem lehet ugyanaz, mint a régi' },
        { status: 400 }
      );
    }

    // Új jelszó hashelése és mentése
    const newPasswordHash = await hashPassword(new_password);

    await db
      .prepare(`
        UPDATE users 
        SET password_hash = ?, updated_at = datetime('now')
        WHERE id = ?
      `)
      .bind(newPasswordHash, user.id)
      .run();

    return NextResponse.json({ 
      success: true, 
      data: { message: 'Jelszó sikeresen megváltoztatva' } 
    });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, error: 'Szerver hiba történt' },
      { status: 500 }
    );
  }
}
