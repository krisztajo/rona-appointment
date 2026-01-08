// Időpontok generálása a beosztások alapján
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ApiResponse, GenerateSlotsRequest } from "@/types/database";

/**
 * POST /api/admin/generate-slots
 * Időpontok generálása egy orvos beosztásai alapján
 * 
 * A rendszer:
 * 1. Lekéri az orvos aktív beosztásait
 * 2. Minden beosztáshoz végigmegy a dátumokon
 * 3. A megadott napokon létrehozza az időpontokat a vizsgálat időtartam szerint
 */
export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const body: GenerateSlotsRequest = await request.json();
    const { doctor_id, schedule_id, from_date, to_date } = body;

    if (!doctor_id) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Hiányzó doctor_id" }, { status: 400 });
    }

    // Orvos adatainak lekérése (vizsgálat időtartam)
    const doctor = await env.DB.prepare(
      "SELECT id, examination_duration FROM doctors WHERE id = ?"
    ).bind(doctor_id).first<{ id: number; examination_duration: number }>();

    if (!doctor) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Orvos nem található" }, { status: 404 });
    }

    const duration = doctor.examination_duration || 30;

    // Beosztások lekérése
    let scheduleQuery = `
      SELECT id, start_date, end_date, days_of_week, start_time, end_time 
      FROM doctor_schedules 
      WHERE doctor_id = ? AND is_active = 1
    `;
    const params: (string | number)[] = [doctor_id];

    if (schedule_id) {
      scheduleQuery += " AND id = ?";
      params.push(schedule_id);
    }

    const schedules = await env.DB.prepare(scheduleQuery).bind(...params).all<{
      id: number;
      start_date: string;
      end_date: string;
      days_of_week: string;
      start_time: string;
      end_time: string;
    }>();

    if (!schedules.results?.length) {
      return NextResponse.json<ApiResponse>({ 
        success: false, 
        error: "Nincsenek aktív beosztások" 
      }, { status: 404 });
    }

    let totalSlotsCreated = 0;
    let totalSkipped = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generálási határok
    const generateFromDate = from_date ? new Date(from_date) : today;
    const maxGenerateDate = to_date ? new Date(to_date) : new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000); // max 90 nap

    for (const schedule of schedules.results) {
      const scheduleStart = new Date(schedule.start_date);
      const scheduleEnd = new Date(schedule.end_date);
      const daysOfWeek = schedule.days_of_week.split(",").map(Number);

      // Tényleges generálási időszak
      const effectiveStart = scheduleStart > generateFromDate ? scheduleStart : generateFromDate;
      const effectiveEnd = scheduleEnd < maxGenerateDate ? scheduleEnd : maxGenerateDate;

      // Minden napra
      const currentDate = new Date(effectiveStart);
      while (currentDate <= effectiveEnd) {
        const dayOfWeek = currentDate.getDay();

        if (daysOfWeek.includes(dayOfWeek)) {
          // Ez a nap benne van a beosztásban
          const dateStr = currentDate.toISOString().split("T")[0];

          // Időpontok generálása ezen a napon
          const slots = generateTimeSlotsForDay(
            schedule.start_time,
            schedule.end_time,
            duration
          );

          for (const slot of slots) {
            // Ellenőrizzük, hogy nem létezik-e már
            const existing = await env.DB.prepare(`
              SELECT id FROM time_slots 
              WHERE doctor_id = ? AND date = ? AND start_time = ?
            `).bind(doctor_id, dateStr, slot.start).first();

            if (!existing) {
              await env.DB.prepare(`
                INSERT INTO time_slots (doctor_id, schedule_id, date, start_time, end_time, is_available)
                VALUES (?, ?, ?, ?, ?, 1)
              `).bind(doctor_id, schedule.id, dateStr, slot.start, slot.end).run();
              totalSlotsCreated++;
            } else {
              totalSkipped++;
            }
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { 
        message: `${totalSlotsCreated} időpont sikeresen létrehozva!`,
        generated: totalSlotsCreated,
        skipped: totalSkipped
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Időpont generálás sikertelen:", msg);
    return NextResponse.json<ApiResponse>({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * Időpontok generálása egy napra
 * @param startTime - napi kezdési idő (pl. "08:00")
 * @param endTime - napi befejezési idő (pl. "12:00")
 * @param durationMinutes - vizsgálat időtartama percben
 * @returns időpont párok tömbje
 */
function generateTimeSlotsForDay(
  startTime: string,
  endTime: string,
  durationMinutes: number
): { start: string; end: string }[] {
  const slots: { start: string; end: string }[] = [];

  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes + durationMinutes <= endMinutes) {
    const slotStartHour = Math.floor(currentMinutes / 60);
    const slotStartMin = currentMinutes % 60;
    
    const slotEndMinutes = currentMinutes + durationMinutes;
    const slotEndHour = Math.floor(slotEndMinutes / 60);
    const slotEndMin = slotEndMinutes % 60;

    slots.push({
      start: `${slotStartHour.toString().padStart(2, "0")}:${slotStartMin.toString().padStart(2, "0")}`,
      end: `${slotEndHour.toString().padStart(2, "0")}:${slotEndMin.toString().padStart(2, "0")}`,
    });

    currentMinutes += durationMinutes;
  }

  return slots;
}
