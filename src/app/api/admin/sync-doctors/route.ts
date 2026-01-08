// Orvosok szinkronizálása a frontendből az adatbázisba
// Ez az endpoint beolvassa a beégetett orvosokat és betölti őket a DB-be
import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { doctors } from "@/data/doctors";
import type { ApiResponse } from "@/types/database";

/**
 * POST /api/admin/sync-doctors
 * A frontendben beégetett orvosokat szinkronizálja az adatbázisba
 */
export async function POST() {
  try {
    const db = getDB();
    let inserted = 0;
    let skipped = 0;

    for (const doctor of doctors) {
      // Ellenőrzés: létezik-e már ez az orvos (slug alapján)
      const existing = await db
        .prepare("SELECT id FROM doctors WHERE slug = ?")
        .bind(doctor.id)
        .first();

      if (existing) {
        skipped++;
        continue;
      }

      // Fő szakterület kiválasztása (az első a listából)
      const specialty = doctor.specialties.join(", ");

      // Orvos beszúrása
      await db
        .prepare("INSERT INTO doctors (slug, name, specialty) VALUES (?, ?, ?)")
        .bind(doctor.id, doctor.name, specialty)
        .run();

      inserted++;
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        message: `Szinkronizálás kész! ${inserted} orvos hozzáadva, ${skipped} már létezett.`,
        inserted,
        skipped,
        total: doctors.length,
      },
    });
  } catch (error) {
    console.error("Orvosok szinkronizálása sikertelen:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Hiba történt a szinkronizálás során" },
      { status: 500 }
    );
  }
}
