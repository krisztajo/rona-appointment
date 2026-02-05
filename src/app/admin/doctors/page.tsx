// Admin - Orvosok kezelése oldal
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Doctor {
  id: number;
  slug: string;
  name: string;
  specialty: string;
  examination_duration: number;
  created_at: string;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Új orvos form
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [examinationDuration, setExaminationDuration] = useState("30");

  // Szerkesztés modal
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [editName, setEditName] = useState("");
  const [editSpecialty, setEditSpecialty] = useState("");
  const [editDuration, setEditDuration] = useState("30");

  // Orvosok betöltése
  const loadDoctors = async () => {
    try {
      const res = await fetch("/api/admin/doctors");
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data || []);
      }
    } catch (error) {
      console.error("Hiba:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // Új orvos létrehozása
  const createDoctor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !specialty) {
      alert("Minden mező kitöltése kötelező!");
      return;
    }

    try {
      const res = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          specialty, 
          examination_duration: parseInt(examinationDuration) || 30 
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Orvos sikeresen hozzáadva!");
        setName("");
        setSpecialty("");
        setExaminationDuration("30");
        loadDoctors();
      } else {
        alert("Hiba: " + data.error);
      }
    } catch {
      alert("Hiba történt");
    }
  };

  // Orvos szerkesztése
  const openEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setEditName(doctor.name);
    setEditSpecialty(doctor.specialty);
    setEditDuration(String(doctor.examination_duration || 30));
  };

  const saveEdit = async () => {
    if (!editingDoctor) return;

    try {
      const res = await fetch("/api/admin/doctors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingDoctor.id,
          name: editName,
          specialty: editSpecialty,
          examination_duration: parseInt(editDuration) || 30,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Orvos sikeresen frissítve!");
        setEditingDoctor(null);
        loadDoctors();
      } else {
        alert("Hiba: " + data.error);
      }
    } catch {
      alert("Hiba történt");
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Orvosok kezelése</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Új orvos form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Új orvos hozzáadása</h2>
          
          <form onSubmit={createDoctor} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Név</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Kovács Péter"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Szakterület</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Belgyógyászat"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vizsgálat időtartam (perc)</label>
              <div className="relative">
                <input
                  type="number"
                  value={examinationDuration}
                  onChange={(e) => setExaminationDuration(e.target.value)}
                  className="w-full border rounded px-3 py-2 pr-12"
                  placeholder="30"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">perc</span>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Hozzáadás
              </button>
            </div>
          </form>
        </div>

        {/* Szerkesztés modal */}
        {editingDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
              <h2 className="text-xl font-bold mb-4">Orvos szerkesztése</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Név</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Szakterület</label>
                  <input
                    type="text"
                    value={editSpecialty}
                    onChange={(e) => setEditSpecialty(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vizsgálat időtartam (perc)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full border rounded px-3 py-2 pr-12"
                      placeholder="30"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">perc</span>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingDoctor(null)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Mégse
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Mentés
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orvosok listája */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Név</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Szakterület</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vizsgálat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Műveletek</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Még nincs orvos az adatbázisban
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{doctor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.specialty}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {doctor.examination_duration || 30} perc
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{doctor.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => openEdit(doctor)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Szerkesztés
                      </button>
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
