// Időpontok API - szabad időpontok lekérdezése és foglalás
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { TimeSlotWithDoctor, CreateAppointmentRequest, ApiResponse } from "@/types/database";

/**
 * GET /api/appointments
 * Szabad időpontok listázása
 * 
 * Query paraméterek:
 * - doctor_id: szűrés orvosra (opcionális)
 * - date: szűrés dátumra (opcionális, "2026-01-15" formátum)
 */
export async function GET(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctor_id");
    const date = searchParams.get("date");

    // Alap lekérdezés - csak szabad időpontokat kérünk
    let query = `
      SELECT 
        ts.*,
        d.name as doctor_name,
        d.specialty as doctor_specialty
      FROM time_slots ts
      JOIN doctors d ON ts.doctor_id = d.id
      WHERE ts.is_available = 1
        AND ts.date >= date('now')
        AND ts.id NOT IN (SELECT time_slot_id FROM appointments WHERE status != 'cancelled')
    `;

    const params: (string | number)[] = [];

    // Szűrések hozzáadása
    if (doctorId) {
      query += " AND ts.doctor_id = ?";
      params.push(parseInt(doctorId));
    }

    if (date) {
      query += " AND ts.date = ?";
      params.push(date);
    }

    query += " ORDER BY ts.date, ts.start_time";

    const result = await env.DB.prepare(query).bind(...params).all<TimeSlotWithDoctor>();

    return NextResponse.json<ApiResponse<TimeSlotWithDoctor[]>>({
      success: true,
      data: result.results,
    });
  } catch (error) {
    console.error("Időpontok lekérdezése sikertelen:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Hiba történt az időpontok lekérdezésekor" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments
 * Új foglalás létrehozása
 * 
 * Body:
 * - time_slot_id: a foglalni kívánt időpont ID-ja
 * - patient_name: páciens neve
 * - patient_email: páciens email címe
 * - patient_phone: páciens telefonszáma
 * - notes: megjegyzés (opcionális)
 */
export async function POST(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const body: CreateAppointmentRequest = await request.json();

    // Validáció
    if (!body.time_slot_id || !body.patient_name || !body.patient_email || !body.patient_phone) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Hiányzó kötelező mezők" },
        { status: 400 }
      );
    }

    // Ellenőrzés: az időpont még szabad-e?
    const slot = await env.DB
      .prepare("SELECT * FROM time_slots WHERE id = ? AND is_available = 1")
      .bind(body.time_slot_id)
      .first();

    if (!slot) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Ez az időpont már nem elérhető" },
        { status: 400 }
      );
    }

    // Ellenőrzés: nincs-e már foglalás erre az időpontra?
    const existingAppointment = await env.DB
      .prepare("SELECT id FROM appointments WHERE time_slot_id = ? AND status != 'cancelled'")
      .bind(body.time_slot_id)
      .first();

    if (existingAppointment) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Ez az időpont már foglalt" },
        { status: 400 }
      );
    }

    // Foglalás létrehozása
    const result = await env.DB.prepare(`
      INSERT INTO appointments (time_slot_id, patient_name, patient_email, patient_phone, notes, status)
      VALUES (?, ?, ?, ?, ?, 'confirmed')
    `).bind(body.time_slot_id, body.patient_name, body.patient_email, body.patient_phone, body.notes || null).run();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { 
        id: result.meta.last_row_id,
        message: "Foglalás sikeresen létrehozva!" 
      },
    });
  } catch (error) {
    console.error("Foglalás sikertelen:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Hiba történt a foglalás során" },
      { status: 500 }
    );
  }
}
