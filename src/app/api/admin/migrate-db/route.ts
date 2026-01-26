// Adatbázis migráció API - meglévő séma frissítése
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ApiResponse } from "@/types/database";

/**
 * POST /api/admin/migrate-db
 * Meglévő adatbázis séma frissítése új oszlopokkal/táblákkal
 */
export async function POST() {
  try {
    const { env } = getCloudflareContext();
    
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "DB binding nem található." },
        { status: 500 }
      );
    }

    const db = env.DB;
    const migrations: string[] = [];

    // 1. Ellenőrizzük, hogy létezik-e a doctor_schedules tábla
    const schedulesTableExists = await db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='doctor_schedules'")
      .first();

    if (!schedulesTableExists) {
      await db.prepare(`
        CREATE TABLE doctor_schedules (
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
      `).run();
      migrations.push("doctor_schedules tábla létrehozva");
    }

    // 2. Ellenőrizzük, hogy a doctors táblában van-e examination_duration oszlop
    const doctorsColumns = await db
      .prepare("PRAGMA table_info(doctors)")
      .all<{ name: string }>();
    
    const hasExaminationDuration = doctorsColumns.results?.some(
      col => col.name === "examination_duration"
    );

    if (!hasExaminationDuration) {
      await db.prepare(
        "ALTER TABLE doctors ADD COLUMN examination_duration INTEGER DEFAULT 30"
      ).run();
      migrations.push("examination_duration oszlop hozzáadva a doctors táblához");
    }

    // 3. Ellenőrizzük, hogy a time_slots táblában van-e schedule_id oszlop
    const slotsColumns = await db
      .prepare("PRAGMA table_info(time_slots)")
      .all<{ name: string }>();
    
    const hasScheduleId = slotsColumns.results?.some(
      col => col.name === "schedule_id"
    );

    if (!hasScheduleId) {
      await db.prepare(
        "ALTER TABLE time_slots ADD COLUMN schedule_id INTEGER REFERENCES doctor_schedules(id) ON DELETE SET NULL"
      ).run();
      migrations.push("schedule_id oszlop hozzáadva a time_slots táblához");
    }

    // 4. Ellenőrizzük, hogy létezik-e a users tábla
    const usersTableExists = await db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
      .first();

    if (!usersTableExists) {
      await db.prepare(`
        CREATE TABLE users (
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
      `).run();
      
      // Indexek létrehozása
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)").run();
      
      migrations.push("users tábla létrehozva (autentikációhoz)");
    }

    if (migrations.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { 
          message: "Az adatbázis már naprakész, nincs szükség migrációra.",
          migrations: []
        },
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { 
        message: "Adatbázis sikeresen frissítve!",
        migrations 
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Adatbázis migráció sikertelen:", errorMessage);
    return NextResponse.json<ApiResponse>(
      { success: false, error: `Hiba történt: ${errorMessage}` },
      { status: 500 }
    );
  }
}
