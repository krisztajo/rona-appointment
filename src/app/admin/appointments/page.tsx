// Admin - Foglalások kezelése oldal
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Appointment {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  doctor_name: string;
  doctor_specialty: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  notes?: string;
  status: string;
  created_at: string;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<number | null>(null);

  // Foglalások betöltése a dedikált API-ból
  const loadAppointments = async () => {
    try {
      const url = filter === "all" 
        ? "/api/admin/appointments" 
        : `/api/admin/appointments?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setAppointments(data.data || []);
      }
    } catch (error) {
      console.error("Hiba:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  // Státusz módosítás
  const updateStatus = async (id: number, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      
      if (data.success) {
        // Frissítjük a listát
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
        );
      } else {
        alert("Hiba: " + data.error);
      }
    } catch (error) {
      console.error("Hiba:", error);
      alert("Hiba történt a státusz módosításakor");
    } finally {
      setUpdating(null);
    }
  };

  // Foglalás törlése
  const deleteAppointment = async (id: number) => {
    if (!confirm("Biztosan törölni szeretnéd ezt a foglalást?")) return;
    
    try {
      const res = await fetch(`/api/admin/appointments?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        setAppointments(prev => prev.filter(apt => apt.id !== id));
      } else {
        alert("Hiba: " + data.error);
      }
    } catch (error) {
      console.error("Hiba:", error);
      alert("Hiba történt a törléskor");
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
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Foglalások</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Szűrő */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
          >
            Összes
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded ${filter === "pending" ? "bg-yellow-500 text-white" : "bg-white text-gray-700"}`}
          >
            Függőben
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-4 py-2 rounded ${filter === "confirmed" ? "bg-green-600 text-white" : "bg-white text-gray-700"}`}
          >
            Megerősítve
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-4 py-2 rounded ${filter === "cancelled" ? "bg-red-600 text-white" : "bg-white text-gray-700"}`}
          >
            Lemondva
          </button>
        </div>

        {/* Foglalások listája */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dátum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Időpont</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orvos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Páciens</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Elérhetőség</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Státusz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Műveletek</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nincs foglalás ebben a kategóriában
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{apt.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {apt.start_time} - {apt.end_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{apt.doctor_name}</div>
                      <div className="text-sm text-gray-500">{apt.doctor_specialty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{apt.patient_name}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{apt.patient_phone}</div>
                      <div className="text-sm text-gray-500">{apt.patient_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          apt.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : apt.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {apt.status === "confirmed"
                          ? "Megerősítve"
                          : apt.status === "cancelled"
                          ? "Lemondva"
                          : "Függőben"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {apt.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(apt.id, "confirmed")}
                              disabled={updating === apt.id}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              {updating === apt.id ? "..." : "Megerősít"}
                            </button>
                            <button
                              onClick={() => updateStatus(apt.id, "cancelled")}
                              disabled={updating === apt.id}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                            >
                              Lemond
                            </button>
                          </>
                        )}
                        {apt.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(apt.id, "cancelled")}
                            disabled={updating === apt.id}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                          >
                            Lemond
                          </button>
                        )}
                        {apt.status === "cancelled" && (
                          <button
                            onClick={() => updateStatus(apt.id, "confirmed")}
                            disabled={updating === apt.id}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            Visszaállít
                          </button>
                        )}
                        <button
                          onClick={() => deleteAppointment(apt.id)}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          Töröl
                        </button>
                      </div>
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
