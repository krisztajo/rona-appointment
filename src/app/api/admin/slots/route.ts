// Admin API - Időpontok kezelése (CRUD)
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { CreateTimeSlotRequest, ApiResponse } from "@/types/database";

/**
 * GET /api/admin/slots
 * Összes időpont listázása (admin számára)
 * 
 * Query paraméterek:
 * - doctor_id: szűrés orvosra
 * - from_date: kezdő dátum
 * - to_date: záró dátum
 */
export async function GET(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctor_id");
    const fromDate = searchParams.get("from_date");
    const toDate = searchParams.get("to_date");

    let query = `
      SELECT 
        ts.*,
        d.name as doctor_name,
        d.specialty as doctor_specialty,
        a.id as appointment_id,
        a.patient_name,
        a.patient_email,
        a.patient_phone,
        a.status as appointment_status
      FROM time_slots ts
      JOIN doctors d ON ts.doctor_id = d.id
      LEFT JOIN appointments a ON ts.id = a.time_slot_id AND a.status != 'cancelled'
      WHERE 1=1
    `;

    const params: (string | number)[] = [];

    if (doctorId) {
      query += " AND ts.doctor_id = ?";
      params.push(parseInt(doctorId));
    }

    if (fromDate) {
      query += " AND ts.date >= ?";
      params.push(fromDate);
    }

    if (toDate) {
      query += " AND ts.date <= ?";
      params.push(toDate);
    }

    query += " ORDER BY ts.date, ts.start_time";

    const result = await env.DB.prepare(query).bind(...params).all();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result.results,
    });
  } catch (error: unknown) {
    // Ha a tábla nem létezik, üres listát adunk vissza
    if (error instanceof Error && error.message.includes("no such table")) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: [],
      });
    }
    console.error("Időpontok lekérdezése sikertelen:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Hiba történt" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/slots
 * Új időpont létrehozása
 */
export async function POST(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const body: CreateTimeSlotRequest = await request.json();

    // Validáció
    if (!body.doctor_id || !body.date || !body.start_time || !body.end_time) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Hiányzó kötelező mezők" },
        { status: 400 }
      );
    }

    // Ütközés ellenőrzés
    const existing = await env.DB
      .prepare(`
        SELECT * FROM time_slots 
        WHERE doctor_id = ? AND date = ? 
        AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))
      `)
      .bind(body.doctor_id, body.date, body.start_time, body.start_time, body.end_time, body.end_time)
      .first();

    if (existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Ütköző időpont már létezik" },
        { status: 400 }
      );
    }

    const result = await env.DB
      .prepare(`
        INSERT INTO time_slots (doctor_id, date, start_time, end_time)
        VALUES (?, ?, ?, ?)
      `)
      .bind(body.doctor_id, body.date, body.start_time, body.end_time)
      .run();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { id: result.meta.last_row_id },
    });
  } catch (error) {
    console.error("Időpont létrehozása sikertelen:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Hiba történt" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/slots
 * Időpont törlése (csak ha nincs foglalás rajta)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Hiányzó időpont ID" },
        { status: 400 }
      );
    }

    // Ellenőrzés: van-e foglalás?
    const slot = await env.DB
      .prepare("SELECT is_available FROM time_slots WHERE id = ?")
      .bind(parseInt(id))
      .first<{ is_available: number }>();

    if (!slot) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Időpont nem található" },
        { status: 404 }
      );
    }

    if (slot.is_available === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Foglalt időpont nem törölhető" },
        { status: 400 }
      );
    }

    await env.DB.prepare("DELETE FROM time_slots WHERE id = ?").bind(parseInt(id)).run();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: "Időpont törölve" },
    });
  } catch (error) {
    console.error("Időpont törlése sikertelen:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Hiba történt" },
      { status: 500 }
    );
  }
}
