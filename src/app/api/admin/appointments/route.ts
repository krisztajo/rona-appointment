// Admin API - Foglalások kezelése
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ApiResponse } from "@/types/database";

/**
 * GET /api/admin/appointments
 * Foglalások listázása
 */
export async function GET(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = `
      SELECT 
        a.id,
        a.time_slot_id,
        a.patient_name,
        a.patient_email,
        a.patient_phone,
        a.notes,
        a.status,
        a.created_at,
        ts.date,
        ts.start_time,
        ts.end_time,
        d.name as doctor_name,
        d.specialty as doctor_specialty
      FROM appointments a
      JOIN time_slots ts ON a.time_slot_id = ts.id
      JOIN doctors d ON ts.doctor_id = d.id
      WHERE 1=1
    `;

    const params: string[] = [];

    if (status) {
      query += " AND a.status = ?";
      params.push(status);
    }

    query += " ORDER BY ts.date DESC, ts.start_time DESC";

    const result = await env.DB.prepare(query).bind(...params).all();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result.results,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("no such table")) {
      return NextResponse.json<ApiResponse>({ success: true, data: [] });
    }
    console.error("Foglalások lekérdezése sikertelen:", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Hiba történt" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/appointments
 * Foglalás státuszának módosítása
 */
export async function PUT(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Hiányzó id vagy status" }, { status: 400 });
    }

    // Csak érvényes státuszok
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Érvénytelen státusz" }, { status: 400 });
    }

    // Foglalás frissítése
    await env.DB.prepare("UPDATE appointments SET status = ? WHERE id = ?").bind(status, id).run();

    // Ha lemondva, az időpontot szabaddá tesszük
    if (status === "cancelled") {
      const appointment = await env.DB.prepare("SELECT time_slot_id FROM appointments WHERE id = ?").bind(id).first<{ time_slot_id: number }>();
      if (appointment) {
        await env.DB.prepare("UPDATE time_slots SET is_available = 1 WHERE id = ?").bind(appointment.time_slot_id).run();
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: "Foglalás státusza frissítve!" },
    });
  } catch (error) {
    console.error("Foglalás frissítése sikertelen:", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Hiba történt" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/appointments
 * Foglalás törlése
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
      return NextResponse.json<ApiResponse>({ success: false, error: "Hiányzó id" }, { status: 400 });
    }

    // Időpont szabaddá tétele
    const appointment = await env.DB.prepare("SELECT time_slot_id FROM appointments WHERE id = ?").bind(parseInt(id)).first<{ time_slot_id: number }>();
    if (appointment) {
      await env.DB.prepare("UPDATE time_slots SET is_available = 1 WHERE id = ?").bind(appointment.time_slot_id).run();
    }

    // Foglalás törlése
    await env.DB.prepare("DELETE FROM appointments WHERE id = ?").bind(parseInt(id)).run();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: "Foglalás törölve!" },
    });
  } catch (error) {
    console.error("Foglalás törlése sikertelen:", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Hiba történt" }, { status: 500 });
  }
}
