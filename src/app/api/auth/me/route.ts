// Aktuális felhasználó lekérése (me endpoint)
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { User, UserPublic } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    // Token kinyerése a headerből
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Hiányzó autentikációs token' },
        { status: 401 }
      );
    }

    // Token ellenőrzése
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Érvénytelen vagy lejárt token' },
        { status: 401 }
      );
    }

    const db = getDB();

    // Felhasználó lekérése az adatbázisból (friss adatok)
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

    // Aktív ellenőrzés
    if (!user.is_active) {
      return NextResponse.json(
        { success: false, error: 'A fiók inaktív' },
        { status: 403 }
      );
    }

    // Publikus adatok visszaadása
    const userPublic: UserPublic = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      doctor_id: user.doctor_id,
      is_active: user.is_active,
      created_at: user.created_at,
    };

    return NextResponse.json({ success: true, data: userPublic });

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, error: 'Szerver hiba történt' },
      { status: 500 }
    );
  }
}
