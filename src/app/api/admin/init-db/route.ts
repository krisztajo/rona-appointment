// Adatbázis inicializálás API
// Ezt az endpointot hívd meg egyszer, hogy létrejöjjenek a táblák
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ApiResponse } from "@/types/database";

/**
 * POST /api/admin/init-db
 * Adatbázis táblák létrehozása
 * FONTOS: Ez csak egyszer kell, vagy ha újra akarod építeni az adatbázist
 */
export async function POST() {
  try {
    const { env } = getCloudflareContext();
    
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "DB binding nem található. Ellenőrizd a wrangler.jsonc fájlt." },
        { status: 500 }
      );
    }

    const db = env.DB;
    
    // Táblák létrehozása külön-külön (D1 batch-el)
    await db.batch([
      // Orvosok tábla - examination_duration mezővel
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
      // Orvos beosztások (ismétlődő időszakok)
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
      // Konkrét időpontok (generált vagy manuális)
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
      // Foglalások
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
      // Adminisztrátorok
      db.prepare(`
        CREATE TABLE IF NOT EXISTS admins (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: "Adatbázis sikeresen inicializálva!" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Adatbázis inicializálás sikertelen:", errorMessage);
    return NextResponse.json<ApiResponse>(
      { success: false, error: `Hiba történt: ${errorMessage}` },
      { status: 500 }
    );
  }
}
