// Adatbázis állapot ellenőrzés
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ApiResponse } from "@/types/database";

/**
 * GET /api/admin/db-status
 * Ellenőrzi, hogy az adatbázis táblák léteznek-e
 */
export async function GET() {
  try {
    // Közvetlenül használjuk a getCloudflareContext-et
    const { env } = getCloudflareContext();
    
    if (!env?.DB) {
      console.error("DB binding nem található!");
      return NextResponse.json<ApiResponse<{ initialized: boolean; error?: string }>>({
        success: false,
        data: { initialized: false },
        error: "DB binding nem található. Ellenőrizd a wrangler.jsonc fájlt.",
      });
    }
    
    // Ellenőrizzük, hogy a doctors tábla létezik-e
    const result = await env.DB
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='doctors'")
      .first();

    return NextResponse.json<ApiResponse<{ initialized: boolean }>>({
      success: true,
      data: { initialized: result !== null },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("DB státusz ellenőrzés sikertelen:", errorMessage);
    return NextResponse.json<ApiResponse<{ initialized: boolean; error?: string }>>({
      success: false,
      data: { initialized: false },
      error: errorMessage,
    });
  }
}
