// API - Orvos adatok lekérdezése slug alapján
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ApiResponse, Doctor } from "@/types/database";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/doctors/[slug]
 * Orvos adatok lekérdezése slug alapján
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const { env } = getCloudflareContext();
    
    if (!env?.DB) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "DB nem elérhető"
      }, { status: 500 });
    }

    const doctor = await env.DB
      .prepare("SELECT * FROM doctors WHERE slug = ?")
      .bind(slug)
      .first<Doctor>();

    if (!doctor) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Orvos nem található"
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: doctor,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("no such table")) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Az adatbázis nincs inicializálva"
      }, { status: 500 });
    }
    console.error("Orvos lekérdezése sikertelen:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Hiba történt" },
      { status: 500 }
    );
  }
}
