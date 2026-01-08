// Admin dashboard - fő oldal
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardStats {
  totalSlots: number;
  availableSlots: number;
  pendingAppointments: number;
  totalDoctors: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Adatbázis inicializálása
  const initDatabase = async () => {
    try {
      const res = await fetch("/api/admin/init-db", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setIsInitialized(true);
        alert("Adatbázis sikeresen inicializálva!");
        loadStats(); // Újratöltés
      } else {
        alert("Hiba: " + data.error);
      }
    } catch (error) {
      alert("Hiba történt az inicializálás során");
    }
  };

  // Adatbázis migráció (új oszlopok/táblák hozzáadása)
  const migrateDatabase = async () => {
    try {
      const res = await fetch("/api/admin/migrate-db", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        const migrations = data.data.migrations || [];
        if (migrations.length > 0) {
          alert("Migráció sikeres!\n\n" + migrations.join("\n"));
        } else {
          alert(data.data.message);
        }
        loadStats();
      } else {
        alert("Hiba: " + data.error);
      }
    } catch (error) {
      alert("Hiba történt a migráció során");
    }
  };

  // Orvosok szinkronizálása a frontendből
  const syncDoctors = async () => {
    try {
      const res = await fetch("/api/admin/sync-doctors", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(data.data.message);
        loadStats(); // Újratöltés
      } else {
        alert("Hiba: " + data.error);
      }
    } catch (error) {
      alert("Hiba történt a szinkronizálás során");
    }
  };

  // Statisztikák betöltése
  const loadStats = async () => {
    try {
      // Először ellenőrizzük, hogy inicializálva van-e az adatbázis
      const dbStatusRes = await fetch("/api/admin/db-status");
      const dbStatus = await dbStatusRes.json();
      
      if (!dbStatus.success || !dbStatus.data?.initialized) {
        setIsInitialized(false);
        setLoading(false);
        return;
      }

      const [slotsRes, doctorsRes] = await Promise.all([
        fetch("/api/admin/slots"),
        fetch("/api/admin/doctors"),
      ]);
      
      const slotsData = await slotsRes.json();
      const doctorsData = await doctorsRes.json();

      if (slotsData.success && doctorsData.success) {
        setIsInitialized(true);
        const slots = slotsData.data || [];
        setStats({
          totalSlots: slots.length,
          availableSlots: slots.filter((s: { is_available: number }) => s.is_available === 1).length,
          pendingAppointments: slots.filter((s: { appointment_status: string }) => s.appointment_status === "pending").length,
          totalDoctors: (doctorsData.data || []).length,
        });
      } else {
        setIsInitialized(false);
      }
    } catch {
      setIsInitialized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Betöltés...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Időpontfoglaló kezelőfelület</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Inicializálás gomb, ha még nincs DB */}
        {isInitialized === false && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Adatbázis inicializálása szükséges
            </h2>
            <p className="text-yellow-700 mb-4">
              Az adatbázis táblák még nincsenek létrehozva. Kattints a gombra az inicializáláshoz.
            </p>
            <button
              onClick={initDatabase}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            >
              Adatbázis inicializálása
            </button>
          </div>
        )}

        {/* Migráció gomb - meglévő DB frissítése */}
        {isInitialized && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-purple-800 mb-2">
              Adatbázis frissítése
            </h2>
            <p className="text-purple-700 mb-4">
              Ha új funkciók kerültek be (pl. időbeosztások, vizsgálati idő), kattints a migrációhoz.
            </p>
            <button
              onClick={migrateDatabase}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            >
              🔄 Adatbázis migráció futtatása
            </button>
          </div>
        )}

        {/* Orvosok szinkronizálása, ha nincs még orvos */}
        {isInitialized && stats && stats.totalDoctors === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Orvosok importálása
            </h2>
            <p className="text-blue-700 mb-4">
              Az adatbázisban még nincsenek orvosok. Importáld a frontendben lévő orvosokat!
            </p>
            <button
              onClick={syncDoctors}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Orvosok importálása
            </button>
          </div>
        )}

        {/* Statisztikák */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Összes időpont" value={stats.totalSlots} color="blue" />
            <StatCard title="Szabad időpont" value={stats.availableSlots} color="green" />
            <StatCard title="Függő foglalás" value={stats.pendingAppointments} color="yellow" />
            <StatCard title="Orvosok száma" value={stats.totalDoctors} color="purple" />
          </div>
        )}

        {/* Gyors navigáció */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <NavCard
            title="Új foglalás"
            description="Új foglalás létrehozása páciens részére"
            href="/admin/booking"
            icon="➕"
          />
          <NavCard
            title="Orvosok"
            description="Orvosok listája, vizsgálati idő beállítása"
            href="/admin/doctors"
            icon="👨‍⚕️"
          />
          <NavCard
            title="Időbeosztások"
            description="Orvosok munkaidejének beállítása: napok, órák"
            href="/admin/schedules"
            icon="🗓️"
          />
          <NavCard
            title="Időpontok"
            description="Generált időpontok megtekintése és kezelése"
            href="/admin/slots"
            icon="📅"
          />
          <NavCard
            title="Foglalások"
            description="Beérkezett foglalások megtekintése és kezelése"
            href="/admin/appointments"
            icon="📋"
          />
        </div>

        {/* Vissza a főoldalra */}
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Vissza a főoldalra
          </Link>
        </div>
      </main>
    </div>
  );
}

// Statisztika kártya komponens
function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center mb-4`}>
        <span className="text-white text-2xl font-bold">{value}</span>
      </div>
      <h3 className="text-gray-600 text-sm">{title}</h3>
    </div>
  );
}

// Navigációs kártya komponens
function NavCard({ title, description, href, icon }: { title: string; description: string; href: string; icon: string }) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
}
