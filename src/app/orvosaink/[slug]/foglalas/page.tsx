// Időpontfoglalás oldal
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

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

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<GroupedSlots>({});
  const [loading, setLoading] = useState(true);
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

  // Ha a felhasználó be van jelentkezve, előre kitöltjük a form mezőket
  useEffect(() => {
    if (user) {
      setPatientName(user.name);
      setPatientEmail(user.email);
    }
  }, [user]);

  const loadData = useCallback(async () => {
    try {
      // Orvos adatok betöltése
      const doctorRes = await fetch(`/api/doctors/${slug}`);
      const doctorData = await doctorRes.json();

      if (!doctorData.success) {
        setLoading(false);
        return;
      }

      setDoctor(doctorData.data);

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
        // Az API slots_by_date mezőjét használjuk
        setSlots(slotsData.data.slots_by_date || {});
      }
    } catch (error) {
      console.error("Hiba az adatok betöltésekor:", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot || !doctor) return;

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
    } catch (error) {
      alert("Hiba történt a foglalás során");
    } finally {
      setSubmitting(false);
    }
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

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Betöltés...</div>
      </div>
    );
  }

  // Ha nincs bejelentkezve, mutassunk bejelentkezési felhívást
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-yellow-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-yellow-800 mb-2">
              Bejelentkezés szükséges
            </h1>
            <p className="text-yellow-700 mb-6">
              Időpontfoglaláshoz kérjük, jelentkezzen be vagy regisztráljon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="inline-block bg-rona-600 text-white px-6 py-3 rounded-lg hover:bg-rona-700 transition-colors font-medium"
              >
                Bejelentkezés
              </Link>
              <Link
                href="/auth/register"
                className="inline-block bg-white text-rona-600 px-6 py-3 rounded-lg border-2 border-rona-600 hover:bg-rona-50 transition-colors font-medium"
              >
                Regisztráció
              </Link>
            </div>
            <div className="mt-6">
              <Link
                href={`/orvosaink/${slug}`}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Vissza az orvos oldalára
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Orvos nem található</h1>
          <Link href="/orvosaink" className="text-rona-600 hover:text-rona-700">
            Vissza az orvosok listájához
          </Link>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-green-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">
              Sikeres foglalás!
            </h1>
            <p className="text-green-700 mb-6">
              Foglalásod rögzítettük. Visszaigazoló e-mailt küldtünk a megadott címre.
            </p>
            <div className="bg-white rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Foglalás részletei:</h3>
              <p className="text-gray-700"><strong>Orvos:</strong> {doctor.name}</p>
              <p className="text-gray-700"><strong>Dátum:</strong> {selectedSlot && formatDate(selectedSlot.date)}</p>
              <p className="text-gray-700"><strong>Időpont:</strong> {selectedSlot?.start_time} - {selectedSlot?.end_time}</p>
            </div>
            <Link
              href={`/orvosaink/${slug}`}
              className="inline-block bg-rona-500 text-white px-6 py-3 rounded-lg hover:bg-rona-600 transition-colors"
            >
              Vissza az orvos oldalára
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedDates = Object.keys(slots).sort();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Vissza link */}
        <Link
          href={`/orvosaink/${slug}`}
          className="inline-flex items-center gap-2 text-rona-600 hover:text-rona-700 mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Vissza
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Időpontfoglalás: {doctor.name}
          </h1>
          <p className="text-gray-600">
            {doctor.specialty} • Vizsgálat időtartama: {doctor.examination_duration || 30} perc
          </p>
        </div>

        {/* Időpontok */}
        {sortedDates.length === 0 ? (
          <div className="bg-yellow-50 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              Jelenleg nincs elérhető időpont. Kérjük, próbálja később!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date) => (
              <div key={date} className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                  {formatDate(date)}
                </h2>
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
                          ? "border-rona-500 bg-rona-50 text-rona-700"
                          : "border-gray-200 hover:border-rona-300 hover:bg-rona-50"
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

        {/* Foglalási form modal */}
        {showForm && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Foglalás megerősítése
                </h2>
                <p className="text-gray-600 mb-6">
                  {formatDate(selectedSlot.date)} • {selectedSlot.start_time} - {selectedSlot.end_time}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Név *
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Teljes név"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rona-500 focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rona-500 focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rona-500 focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rona-500 focus:border-transparent resize-none"
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
                      className="flex-1 px-4 py-3 bg-rona-500 text-white rounded-lg hover:bg-rona-600 transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Küldés..." : "Foglalás"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
