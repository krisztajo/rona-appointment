// Orvos beosztások (schedules) kezelése
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ApiResponse, CreateScheduleRequest } from "@/types/database";

/**
 * GET /api/admin/schedules
 * Összes beosztás lekérdezése, opcionálisan orvos szerint szűrve
 */
export async function GET(request: Request) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctor_id");

    let query = `
      SELECT 
        ds.*,
        d.name as doctor_name,
        d.specialty as doctor_specialty
      FROM doctor_schedules ds
      JOIN doctors d ON ds.doctor_id = d.id
    `;
    
    const params: (string | number)[] = [];
    
    if (doctorId) {
      query += " WHERE ds.doctor_id = ?";
      params.push(Number(doctorId));
    }
    
    query += " ORDER BY ds.start_date DESC";

    const result = await env.DB.prepare(query).bind(...params).all();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result.results,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Beosztások lekérdezése sikertelen:", msg);
    return NextResponse.json<ApiResponse>({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * POST /api/admin/schedules
 * Új beosztás létrehozása
 */
export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const body: CreateScheduleRequest = await request.json();
    const { doctor_id, start_date, end_date, days_of_week, start_time, end_time } = body;

    // Validáció
    if (!doctor_id || !start_date || !end_date || !days_of_week?.length || !start_time || !end_time) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Hiányzó mezők" },
        { status: 400 }
      );
    }

    // days_of_week tömböt string-gé alakítjuk (pl. "1,3,5")
    const daysString = days_of_week.join(",");

    const result = await env.DB.prepare(`
      INSERT INTO doctor_schedules (doctor_id, start_date, end_date, days_of_week, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(doctor_id, start_date, end_date, daysString, start_time, end_time).run();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { 
        id: result.meta.last_row_id,
        message: "Beosztás sikeresen létrehozva!" 
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Beosztás létrehozása sikertelen:", msg);
    return NextResponse.json<ApiResponse>({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * PUT /api/admin/schedules
 * Beosztás módosítása
 */
export async function PUT(request: Request) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const body = await request.json();
    const { id, start_date, end_date, days_of_week, start_time, end_time, is_active } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Hiányzó id" }, { status: 400 });
    }

    const daysString = Array.isArray(days_of_week) ? days_of_week.join(",") : days_of_week;

    await env.DB.prepare(`
      UPDATE doctor_schedules 
      SET start_date = ?, end_date = ?, days_of_week = ?, start_time = ?, end_time = ?, is_active = ?
      WHERE id = ?
    `).bind(start_date, end_date, daysString, start_time, end_time, is_active ?? 1, id).run();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: "Beosztás sikeresen módosítva!" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json<ApiResponse>({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/schedules
 * Beosztás törlése
 */
export async function DELETE(request: Request) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Hiányzó id" }, { status: 400 });
    }

    // Töröljük a beosztáshoz tartozó generált időpontokat is (ahol nincs foglalás)
    await env.DB.prepare(`
      DELETE FROM time_slots 
      WHERE schedule_id = ? 
      AND id NOT IN (SELECT time_slot_id FROM appointments)
    `).bind(Number(id)).run();

    await env.DB.prepare("DELETE FROM doctor_schedules WHERE id = ?").bind(Number(id)).run();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: "Beosztás sikeresen törölve!" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json<ApiResponse>({ success: false, error: msg }, { status: 500 });
  }
}
