// Szabad időpontok lekérdezése páciensek számára
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ApiResponse, TimeSlotWithDoctor } from "@/types/database";

interface Params {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/doctors/[slug]/available-slots
 * Egy orvos szabad időpontjainak lekérdezése
 * 
 * Query paraméterek:
 * - from: kezdő dátum (alapértelmezett: ma)
 * - to: záró dátum (alapértelmezett: +30 nap)
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    // Dátum paraméterek
    const today = new Date().toISOString().split("T")[0];
    const defaultTo = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    
    const fromDate = searchParams.get("from") || today;
    const toDate = searchParams.get("to") || defaultTo;

    // Orvos keresése slug alapján
    const doctor = await env.DB.prepare(
      "SELECT id, name, specialty, examination_duration FROM doctors WHERE slug = ?"
    ).bind(slug).first<{ id: number; name: string; specialty: string; examination_duration: number }>();

    if (!doctor) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Orvos nem található" }, { status: 404 });
    }

    // Szabad időpontok lekérdezése
    const result = await env.DB.prepare(`
      SELECT 
        ts.id,
        ts.doctor_id,
        ts.date,
        ts.start_time,
        ts.end_time,
        ts.is_available,
        ts.created_at,
        ? as doctor_name,
        ? as doctor_specialty
      FROM time_slots ts
      WHERE ts.doctor_id = ?
        AND ts.is_available = 1
        AND ts.date >= ?
        AND ts.date <= ?
        AND ts.id NOT IN (
          SELECT time_slot_id FROM appointments WHERE status != 'cancelled'
        )
      ORDER BY ts.date, ts.start_time
    `).bind(doctor.name, doctor.specialty, doctor.id, fromDate, toDate).all<TimeSlotWithDoctor>();

    // Időpontok csoportosítása napok szerint
    const slotsByDate: Record<string, TimeSlotWithDoctor[]> = {};
    for (const slot of result.results || []) {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = [];
      }
      slotsByDate[slot.date].push(slot);
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        doctor: {
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty,
          examination_duration: doctor.examination_duration,
        },
        slots: result.results || [],
        slots_by_date: slotsByDate,
        date_range: { from: fromDate, to: toDate },
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Szabad időpontok lekérdezése sikertelen:", msg);
    return NextResponse.json<ApiResponse>({ success: false, error: msg }, { status: 500 });
  }
}
