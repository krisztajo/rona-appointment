// Admin - Időpontok kezelése oldal
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

interface TimeSlot {
  id: number;
  doctor_id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_available: number;
  doctor_name: string;
  patient_name?: string;
  patient_email?: string;
  patient_phone?: string;
  appointment_status?: string;
}

export default function AdminSlotsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Új időpont form
  const [selectedDoctor, setSelectedDoctor] = useState<number | "">("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");
  
  // Szűrők
  const [filterDoctor, setFilterDoctor] = useState<number | "">("");
  const [filterDate, setFilterDate] = useState("");

  // Adatok betöltése
  const loadData = async () => {
    try {
      const [doctorsRes, slotsRes] = await Promise.all([
        fetch("/api/admin/doctors"),
        fetch("/api/admin/slots"),
      ]);
      
      const doctorsData = await doctorsRes.json();
      const slotsData = await slotsRes.json();

      if (doctorsData.success) setDoctors(doctorsData.data || []);
      if (slotsData.success) setSlots(slotsData.data || []);
    } catch (error) {
      console.error("Hiba:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Új időpont létrehozása
  const createSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate) {
      alert("Válassz orvost és dátumot!");
      return;
    }

    try {
      const res = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: selectedDoctor,
          date: selectedDate,
          start_time: startTime,
          end_time: endTime,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Időpont sikeresen létrehozva!");
        loadData(); // Újratöltés
      } else {
        alert("Hiba: " + data.error);
      }
    } catch (error) {
      alert("Hiba történt");
    }
  };

  // Időpont törlése
  const deleteSlot = async (id: number) => {
    if (!confirm("Biztosan törlöd ezt az időpontot?")) return;

    try {
      const res = await fetch(`/api/admin/slots?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (data.success) {
        loadData();
      } else {
        alert("Hiba: " + data.error);
      }
    } catch (error) {
      alert("Hiba történt");
    }
  };

  // Több időpont generálása egyszerre
  const generateSlots = async () => {
    if (!selectedDoctor || !selectedDate) {
      alert("Válassz orvost és dátumot!");
      return;
    }

    const slotsToCreate = [];
    let hour = 9;
    
    // 9:00-tól 16:30-ig, 30 perces időpontok
    while (hour < 17) {
      for (const minute of [0, 30]) {
        if (hour === 16 && minute === 30) continue;
        
        const start = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const endMinute = minute === 30 ? 0 : 30;
        const endHour = minute === 30 ? hour + 1 : hour;
        const end = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
        
        slotsToCreate.push({ start, end });
      }
      hour++;
    }

    for (const slot of slotsToCreate) {
      await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: selectedDoctor,
          date: selectedDate,
          start_time: slot.start,
          end_time: slot.end,
        }),
      });
    }

    alert(`${slotsToCreate.length} időpont létrehozva!`);
    loadData();
  };

  // Szűrt időpontok
  const filteredSlots = slots.filter((slot) => {
    if (filterDoctor && slot.doctor_id !== filterDoctor) return false;
    if (filterDate && slot.date !== filterDate) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Betöltés...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Vissza a dashboardra
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Időpontok kezelése</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Új időpont form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Új időpont létrehozása</h2>
          
          <form onSubmit={createSlot} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orvos</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value ? parseInt(e.target.value) : "")}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Válassz orvost...</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dátum</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kezdés</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vége</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Létrehozás
              </button>
              <button
                type="button"
                onClick={generateSlots}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Egész nap
              </button>
            </div>
          </form>
        </div>

        {/* Szűrők */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Szűrés orvosra</label>
              <select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value ? parseInt(e.target.value) : "")}
                className="border rounded px-3 py-2"
              >
                <option value="">Összes orvos</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Szűrés dátumra</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Időpontok listája */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dátum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Időpont</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orvos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Státusz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Páciens</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Műveletek</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSlots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nincs találat
                  </td>
                </tr>
              ) : (
                filteredSlots.map((slot) => (
                  <tr key={slot.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{slot.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {slot.start_time} - {slot.end_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{slot.doctor_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          slot.is_available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {slot.is_available ? "Szabad" : "Foglalt"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {slot.patient_name ? (
                        <div>
                          <div className="font-medium">{slot.patient_name}</div>
                          <div className="text-sm text-gray-500">{slot.patient_phone}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {slot.is_available ? (
                        <button
                          onClick={() => deleteSlot(slot.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Törlés
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
