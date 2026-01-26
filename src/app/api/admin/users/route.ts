// Felhasználók kezelése API (Superadmin)
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { 
  verifyToken, 
  extractTokenFromHeader,
  hashPassword,
  validatePassword,
  validateEmail
} from '@/lib/auth';
import { User, UserPublic, CreateUserRequest, UpdateUserRequest, UserRole } from '@/types/database';

export const runtime = 'edge';

// Összes felhasználó lekérése (superadmin)
export async function GET(request: NextRequest) {
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

    // Csak superadmin férhet hozzá
    if (payload.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, error: 'Nincs jogosultsága ehhez a művelethez' },
        { status: 403 }
      );
    }

    const db = getDB();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = `
      SELECT u.id, u.email, u.name, u.role, u.doctor_id, u.is_active, u.created_at,
             d.name as doctor_name
      FROM users u
      LEFT JOIN doctors d ON u.doctor_id = d.id
    `;
    
    const params: string[] = [];
    
    if (role) {
      query += ' WHERE u.role = ?';
      params.push(role);
    }
    
    query += ' ORDER BY u.created_at DESC';

    const result = params.length > 0
      ? await db.prepare(query).bind(...params).all()
      : await db.prepare(query).all();

    return NextResponse.json({ success: true, data: result.results });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Szerver hiba történt' },
      { status: 500 }
    );
  }
}

// Új felhasználó létrehozása (superadmin)
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

    // Csak superadmin hozhat létre felhasználót
    if (payload.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, error: 'Nincs jogosultsága ehhez a művelethez' },
        { status: 403 }
      );
    }

    const body: CreateUserRequest = await request.json();
    const { email, password, name, role, doctor_id } = body;

    // Validáció
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { success: false, error: 'Email, jelszó, név és szerepkör megadása kötelező' },
        { status: 400 }
      );
    }

    // Szerepkör validáció
    const validRoles: UserRole[] = ['user', 'admin', 'doctor', 'superadmin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Érvénytelen szerepkör' },
        { status: 400 }
      );
    }

    // Doctor szerepkörnél kötelező a doctor_id
    if (role === 'doctor' && !doctor_id) {
      return NextResponse.json(
        { success: false, error: 'Orvos szerepkörhöz kötelező megadni az orvos ID-t' },
        { status: 400 }
      );
    }

    // Email validáció
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Érvénytelen email cím formátum' },
        { status: 400 }
      );
    }

    // Jelszó validáció
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.errors.join('. ') },
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

    // Felhasználó létrehozása
    const result = await db
      .prepare(`
        INSERT INTO users (email, password_hash, name, role, doctor_id, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
      `)
      .bind(email.toLowerCase(), passwordHash, name.trim(), role, doctor_id || null)
      .run();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Hiba történt a felhasználó létrehozása során' },
        { status: 500 }
      );
    }

    // Új felhasználó lekérése
    const newUser = await db
      .prepare('SELECT id, email, name, role, doctor_id, is_active, created_at FROM users WHERE id = ?')
      .bind(result.meta.last_row_id)
      .first<UserPublic>();

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, error: 'Szerver hiba történt' },
      { status: 500 }
    );
  }
}

// Felhasználó módosítása (superadmin)
export async function PUT(request: NextRequest) {
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

    // Csak superadmin módosíthat felhasználót
    if (payload.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, error: 'Nincs jogosultsága ehhez a művelethez' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Felhasználó ID megadása kötelező' },
        { status: 400 }
      );
    }

    const body: UpdateUserRequest = await request.json();
    const { email, name, role, doctor_id, is_active } = body;

    const db = getDB();

    // Felhasználó létezik-e
    const existingUser = await db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(parseInt(userId))
      .first<User>();

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Felhasználó nem található' },
        { status: 404 }
      );
    }

    // Nem lehet saját superadmin jogot elvenni
    if (existingUser.id === payload.userId && role && role !== 'superadmin') {
      return NextResponse.json(
        { success: false, error: 'Nem veheti el saját superadmin jogosultságát' },
        { status: 400 }
      );
    }

    // Dinamikus UPDATE query építés
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (email) {
      if (!validateEmail(email)) {
        return NextResponse.json(
          { success: false, error: 'Érvénytelen email cím formátum' },
          { status: 400 }
        );
      }
      updates.push('email = ?');
      values.push(email.toLowerCase());
    }

    if (name) {
      updates.push('name = ?');
      values.push(name.trim());
    }

    if (role) {
      const validRoles: UserRole[] = ['user', 'admin', 'doctor', 'superadmin'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { success: false, error: 'Érvénytelen szerepkör' },
          { status: 400 }
        );
      }
      updates.push('role = ?');
      values.push(role);
    }

    if (doctor_id !== undefined) {
      updates.push('doctor_id = ?');
      values.push(doctor_id);
    }

    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nincs módosítandó adat' },
        { status: 400 }
      );
    }

    updates.push("updated_at = datetime('now')");
    values.push(parseInt(userId));

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await db.prepare(query).bind(...values).run();

    // Frissített felhasználó lekérése
    const updatedUser = await db
      .prepare('SELECT id, email, name, role, doctor_id, is_active, created_at FROM users WHERE id = ?')
      .bind(parseInt(userId))
      .first<UserPublic>();

    return NextResponse.json({ success: true, data: updatedUser });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Szerver hiba történt' },
      { status: 500 }
    );
  }
}

// Felhasználó törlése (superadmin)
export async function DELETE(request: NextRequest) {
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

    // Csak superadmin törölhet felhasználót
    if (payload.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, error: 'Nincs jogosultsága ehhez a művelethez' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Felhasználó ID megadása kötelező' },
        { status: 400 }
      );
    }

    const userIdNum = parseInt(userId);

    // Nem törölheti saját magát
    if (userIdNum === payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Nem törölheti saját fiókját' },
        { status: 400 }
      );
    }

    const db = getDB();

    // Felhasználó létezik-e
    const existingUser = await db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(userIdNum)
      .first();

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Felhasználó nem található' },
        { status: 404 }
      );
    }

    // Törlés
    await db.prepare('DELETE FROM users WHERE id = ?').bind(userIdNum).run();

    return NextResponse.json({ 
      success: true, 
      data: { message: 'Felhasználó sikeresen törölve' } 
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Szerver hiba történt' },
      { status: 500 }
    );
  }
}
