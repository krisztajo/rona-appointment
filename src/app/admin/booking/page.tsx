// Admin - Új foglalás létrehozása
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Doctor {
  id: number;
  slug: string;
  name: string;
  specialty: string;
  examination_duration: number;
}

interface TimeSlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
}

interface GroupedSlots {
  [date: string]: TimeSlot[];
}

export default function AdminBookingPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<GroupedSlots>({});
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Success state
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Orvosok betöltése
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await fetch("/api/admin/doctors");
        const data = await res.json();
        if (data.success) {
          setDoctors(data.data || []);
        }
      } catch (error) {
        console.error("Hiba az orvosok betöltésekor:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  // Időpontok betöltése az adott orvoshoz
  const loadSlots = useCallback(async (slug: string) => {
    setLoadingSlots(true);
    try {
      // Következő 30 nap időpontjai
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 30);

      const fromDate = today.toISOString().split("T")[0];
      const toDate = endDate.toISOString().split("T")[0];

      const slotsRes = await fetch(
        `/api/doctors/${slug}/available-slots?from=${fromDate}&to=${toDate}`
      );
      const slotsData = await slotsRes.json();

      if (slotsData.success && slotsData.data) {
        setSlots(slotsData.data.slots_by_date || {});
      }
    } catch (error) {
      console.error("Hiba az időpontok betöltésekor:", error);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Orvos kiválasztása
  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setShowForm(false);
    setSlots({});
    loadSlots(doctor.slug);
  };

  // Form beküldése
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot || !selectedDoctor) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          time_slot_id: selectedSlot.id,
          patient_name: patientName,
          patient_email: patientEmail,
          patient_phone: patientPhone,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setBookingSuccess(true);
        setShowForm(false);
      } else {
        alert("Hiba: " + data.error);
      }
    } catch {
      alert("Hiba történt a foglalás során");
    } finally {
      setSubmitting(false);
    }
  };

  // Új foglalás indítása (sikeres foglalás után)
  const handleNewBooking = () => {
    setBookingSuccess(false);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setPatientName("");
    setPatientEmail("");
    setPatientPhone("");
    setNotes("");
    setSlots({});
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("hu-HU", options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Betöltés...</div>
      </div>
    );
  }

  // Sikeres foglalás képernyő
  if (bookingSuccess && selectedDoctor && selectedSlot) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm">
              ← Vissza a dashboardra
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Új foglalás</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-green-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Sikeres foglalás!
            </h2>
            <p className="text-green-700 mb-6">
              A foglalás sikeresen rögzítésre került.
            </p>
            <div className="bg-white rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-2">Foglalás részletei:</h3>
              <p className="text-gray-700"><strong>Orvos:</strong> {selectedDoctor.name}</p>
              <p className="text-gray-700"><strong>Dátum:</strong> {formatDate(selectedSlot.date)}</p>
              <p className="text-gray-700"><strong>Időpont:</strong> {selectedSlot.start_time} - {selectedSlot.end_time}</p>
              <p className="text-gray-700"><strong>Páciens:</strong> {patientName}</p>
              <p className="text-gray-700"><strong>Email:</strong> {patientEmail}</p>
              <p className="text-gray-700"><strong>Telefon:</strong> {patientPhone}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleNewBooking}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Új foglalás
              </button>
              <Link
                href="/admin/appointments"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Foglalások listája
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const sortedDates = Object.keys(slots).sort();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Vissza a dashboardra
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Új foglalás</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 1. lépés: Orvos kiválasztása - csak ha még nincs kiválasztva */}
        {!selectedDoctor && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              1. Orvos kiválasztása
            </h2>
            {doctors.length === 0 ? (
              <p className="text-gray-500">Nincsenek orvosok az adatbázisban.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => handleSelectDoctor(doctor)}
                    className="p-4 rounded-lg border-2 text-left transition-all border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div className="font-medium text-gray-900">{doctor.name}</div>
                    <div className="text-sm text-gray-600">{doctor.specialty}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Vizsgálat: {doctor.examination_duration || 30} perc
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. lépés: Időpont kiválasztása */}
        {selectedDoctor && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Időpont kiválasztása - {selectedDoctor.name}
              </h2>
              <button
                onClick={() => {
                  setSelectedDoctor(null);
                  setSlots({});
                  setSelectedSlot(null);
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                ← Másik orvos
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {selectedDoctor.specialty} • Vizsgálat: {selectedDoctor.examination_duration || 30} perc
            </p>

            {loadingSlots ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Időpontok betöltése...</div>
              </div>
            ) : sortedDates.length === 0 ? (
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-yellow-800">
                  Jelenleg nincs elérhető időpont ennél az orvosnál.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDates.map((date) => (
                  <div key={date} className="border-b border-gray-100 pb-4 last:border-0">
                    <h3 className="text-md font-medium text-gray-800 mb-3 capitalize">
                      {formatDate(date)}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {slots[date].map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setShowForm(true);
                          }}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            selectedSlot?.id === slot.id
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          {slot.start_time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Foglalási form modal */}
        {showForm && selectedSlot && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Foglalás megerősítése
                </h2>
                <div className="text-gray-600 mb-6">
                  <p className="font-medium">{selectedDoctor.name}</p>
                  <p>{formatDate(selectedSlot.date)} • {selectedSlot.start_time} - {selectedSlot.end_time}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Páciens neve *
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Teljes név"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail cím *
                    </label>
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="pelda@email.hu"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefonszám *
                    </label>
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+36 30 123 4567"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Megjegyzés (opcionális)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Pl. panaszok, korábbi vizsgálatok..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setSelectedSlot(null);
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Mégse
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Küldés..." : "Foglalás"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
