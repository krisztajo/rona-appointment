// Regisztrációs API végpont
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { 
  hashPassword, 
  validatePassword, 
  validateEmail, 
  generateToken 
} from '@/lib/auth';
import { User, UserPublic, RegisterRequest, AuthResponse } from '@/types/database';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, name } = body;

    // Validáció
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Minden mező kitöltése kötelező' },
        { status: 400 }
      );
    }

    // Email formátum ellenőrzés
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Érvénytelen email cím formátum' },
        { status: 400 }
      );
    }

    // Jelszó erősség ellenőrzés
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.errors.join('. ') },
        { status: 400 }
      );
    }

    // Név validáció
    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'A név legalább 2 karakter hosszú kell legyen' },
        { status: 400 }
      );
    }

    const db = getDB();

    // Email egyediség ellenőrzése
    const existingUser = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email.toLowerCase())
      .first();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Ez az email cím már regisztrálva van' },
        { status: 409 }
      );
    }

    // Jelszó hashelése
    const passwordHash = await hashPassword(password);

    // Felhasználó létrehozása (alapértelmezett szerepkör: user)
    const result = await db
      .prepare(`
        INSERT INTO users (email, password_hash, name, role, is_active, created_at, updated_at)
        VALUES (?, ?, ?, 'user', 1, datetime('now'), datetime('now'))
      `)
      .bind(email.toLowerCase(), passwordHash, name.trim())
      .run();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Hiba történt a regisztráció során' },
        { status: 500 }
      );
    }

    // Új felhasználó lekérése
    const newUser = await db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(result.meta.last_row_id)
      .first<User>();

    if (!newUser) {
      return NextResponse.json(
        { success: false, error: 'Felhasználó létrehozva, de nem található' },
        { status: 500 }
      );
    }

    // Publikus felhasználói adatok
    const userPublic: UserPublic = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      doctor_id: newUser.doctor_id,
      is_active: newUser.is_active,
      created_at: newUser.created_at,
    };

    // JWT token generálása
    const token = await generateToken(userPublic);

    const response: AuthResponse = {
      user: userPublic,
      token,
    };

    return NextResponse.json({ success: true, data: response }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Szerver hiba történt' },
      { status: 500 }
    );
  }
}
