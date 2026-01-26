// Bejelentkezési API végpont
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { 
  verifyPassword, 
  generateToken, 
  isAccountLocked,
  calculateLockoutTime,
  MAX_FAILED_ATTEMPTS,
  LOCKOUT_DURATION_MINUTES
} from '@/lib/auth';
import { User, UserPublic, LoginRequest, AuthResponse } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validáció
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email és jelszó megadása kötelező' },
        { status: 400 }
      );
    }

    const db = getDB();

    // Felhasználó keresése
    const user = await db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email.toLowerCase())
      .first<User>();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Hibás email vagy jelszó' },
        { status: 401 }
      );
    }

    // Fiók aktív-e?
    if (!user.is_active) {
      return NextResponse.json(
        { success: false, error: 'A fiók inaktív. Kérjük, vegye fel a kapcsolatot az adminisztrátorral.' },
        { status: 403 }
      );
    }

    // Fiók zárolás ellenőrzése
    if (isAccountLocked(user.locked_until)) {
      const lockUntil = new Date(user.locked_until!);
      const remainingMinutes = Math.ceil((lockUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { 
          success: false, 
          error: `A fiók ideiglenesen zárolva van. Próbálja újra ${remainingMinutes} perc múlva.` 
        },
        { status: 423 }
      );
    }

    // Jelszó ellenőrzése
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      // Sikertelen bejelentkezési kísérlet számláló növelése
      const newFailedAttempts = user.failed_login_attempts + 1;
      
      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        // Fiók zárolása
        const lockedUntil = calculateLockoutTime();
        await db
          .prepare(`
            UPDATE users 
            SET failed_login_attempts = ?, 
                last_failed_login = datetime('now'),
                locked_until = ?
            WHERE id = ?
          `)
          .bind(newFailedAttempts, lockedUntil, user.id)
          .run();

        return NextResponse.json(
          { 
            success: false, 
            error: `Túl sok sikertelen kísérlet. A fiók ${LOCKOUT_DURATION_MINUTES} percre zárolva.` 
          },
          { status: 423 }
        );
      } else {
        // Számláló növelése
        await db
          .prepare(`
            UPDATE users 
            SET failed_login_attempts = ?, 
                last_failed_login = datetime('now')
            WHERE id = ?
          `)
          .bind(newFailedAttempts, user.id)
          .run();

        const remainingAttempts = MAX_FAILED_ATTEMPTS - newFailedAttempts;
        return NextResponse.json(
          { 
            success: false, 
            error: `Hibás email vagy jelszó. Még ${remainingAttempts} kísérlet maradt.` 
          },
          { status: 401 }
        );
      }
    }

    // Sikeres bejelentkezés - számláló nullázása
    await db
      .prepare(`
        UPDATE users 
        SET failed_login_attempts = 0, 
            last_failed_login = NULL,
            locked_until = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `)
      .bind(user.id)
      .run();

    // Publikus felhasználói adatok
    const userPublic: UserPublic = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      doctor_id: user.doctor_id,
      is_active: user.is_active,
      created_at: user.created_at,
    };

    // JWT token generálása
    const token = await generateToken(userPublic);

    const response: AuthResponse = {
      user: userPublic,
      token,
    };

    return NextResponse.json({ success: true, data: response });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Szerver hiba történt' },
      { status: 500 }
    );
  }
}
