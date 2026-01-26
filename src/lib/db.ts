// Adatbázis segédfüggvények
// Központi hely a D1 adatbázis eléréséhez

import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * D1 adatbázis lekérése a Cloudflare kontextusból
 * 
 * Működés:
 * - Lokálisan: A wrangler szimulálja a D1-et a .wrangler mappában
 * - Cloudflare-en: A valódi D1 adatbázishoz csatlakozik
 */
export function getDB(): D1Database {
  try {
    const context = getCloudflareContext();
    console.log("Cloudflare context:", context ? "OK" : "NULL");
    console.log("context.env:", context?.env ? "OK" : "NULL");
    console.log("context.env.DB:", context?.env?.DB ? "OK" : "NULL");
    
    if (!context || !context.env) {
      throw new Error("Cloudflare context nem elérhető. Győződj meg róla, hogy az initOpenNextCloudflareForDev() meg van hívva a next.config.ts-ben.");
    }
    
    if (!context.env.DB) {
      throw new Error("DB binding nem található. Ellenőrizd a wrangler.jsonc fájlban a d1_databases konfigurációt.");
    }
    
    return context.env.DB;
  } catch (error) {
    console.error("D1 adatbázis elérési hiba:", error);
    throw error;
  }
}

/**
 * Adatbázis inicializálása a schema.sql alapján
 * Ezt egyszer kell futtatni, amikor először indul az app
 */
export async function initializeDatabase() {
  const db = getDB();
  
  // Táblák létrehozása külön-külön (D1 batch-el)
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        examination_duration INTEGER DEFAULT 30,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS doctor_schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_id INTEGER NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        days_of_week TEXT NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS time_slots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_id INTEGER NOT NULL,
        schedule_id INTEGER,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_available INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
        FOREIGN KEY (schedule_id) REFERENCES doctor_schedules(id) ON DELETE SET NULL
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        time_slot_id INTEGER NOT NULL,
        patient_name TEXT NOT NULL,
        patient_email TEXT NOT NULL,
        patient_phone TEXT NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (time_slot_id) REFERENCES time_slots(id)
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        doctor_id INTEGER,
        is_active INTEGER DEFAULT 1,
        failed_login_attempts INTEGER DEFAULT 0,
        last_failed_login DATETIME,
        locked_until DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id)
      )
    `),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_time_slots_doctor ON time_slots(doctor_id)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)"),
  ]);
}
