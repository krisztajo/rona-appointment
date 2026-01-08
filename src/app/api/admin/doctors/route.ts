// Orvosok API - CRUD műveletek
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Doctor, ApiResponse } from "@/types/database";

/**
 * GET /api/admin/doctors
 * Összes orvos listázása
 */
export async function GET() {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const result = await env.DB.prepare("SELECT * FROM doctors ORDER BY name").all<Doctor>();

    return NextResponse.json<ApiResponse<Doctor[]>>({
      success: true,
      data: result.results,
    });
  } catch (error: unknown) {
    // Ha a tábla nem létezik, üres listát adunk vissza
    if (error instanceof Error && error.message.includes("no such table")) {
      return NextResponse.json<ApiResponse<Doctor[]>>({
        success: true,
        data: [],
      });
    }
    console.error("Orvosok lekérdezése sikertelen:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Hiba történt" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/doctors
 * Új orvos hozzáadása
 */
export async function POST(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const body = await request.json();

    if (!body.name || !body.specialty) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Hiányzó kötelező mezők (name, specialty)" },
        { status: 400 }
      );
    }

    // Slug generálása a névből
    const slug = body.slug || body.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Ékezetek eltávolítása
      .replace(/[^a-z0-9]+/g, "-")     // Nem alfanumerikus -> kötőjel
      .replace(/^-|-$/g, "");          // Szélső kötőjelek eltávolítása

    const examinationDuration = body.examination_duration || 30;

    const result = await env.DB
      .prepare("INSERT INTO doctors (slug, name, specialty, examination_duration) VALUES (?, ?, ?, ?)")
      .bind(slug, body.name, body.specialty, examinationDuration)
      .run();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { id: result.meta.last_row_id, slug },
    });
  } catch (error) {
    console.error("Orvos létrehozása sikertelen:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Hiba történt" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/doctors
 * Orvos adatainak módosítása (beleértve vizsgálat időtartam)
 */
export async function PUT(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({ success: false, error: "DB nem elérhető" }, { status: 500 });
    }

    const body = await request.json();
    const { id, name, specialty, examination_duration } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Hiányzó id" }, { status: 400 });
    }

    await env.DB.prepare(`
      UPDATE doctors 
      SET name = COALESCE(?, name), 
          specialty = COALESCE(?, specialty), 
          examination_duration = COALESCE(?, examination_duration)
      WHERE id = ?
    `).bind(name, specialty, examination_duration, id).run();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: "Orvos adatai módosítva!" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json<ApiResponse>({ success: false, error: msg }, { status: 500 });
  }
}
