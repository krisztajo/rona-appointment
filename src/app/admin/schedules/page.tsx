// Admin - Időbeosztások kezelése
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  examination_duration: number;
}

interface DoctorSchedule {
  id: number;
  doctor_id: number;
  start_date: string;
  end_date: string;
  days_of_week: string;
  start_time: string;
  end_time: string;
  is_active: number;
  doctor_name?: string;
}

// Naponkénti időbeosztás típus
interface DaySchedule {
  enabled: boolean;
  start_time: string;
  end_time: string;
}

interface ScheduleFormData {
  doctor_id: number | null;
  start_date: string;
  end_date: string;
  // Régi mező kompatibilitáshoz
  days_of_week: number[];
  start_time: string;
  end_time: string;
  is_active: boolean;
  // Új: naponkénti beállítások
  daySchedules: { [key: number]: DaySchedule };
}

const DAYS = [
  { value: 1, label: "Hétfő", short: "H" },
  { value: 2, label: "Kedd", short: "K" },
  { value: 3, label: "Szerda", short: "Sze" },
  { value: 4, label: "Csütörtök", short: "Cs" },
  { value: 5, label: "Péntek", short: "P" },
  { value: 6, label: "Szombat", short: "Szo" },
  { value: 0, label: "Vasárnap", short: "V" },
];

const defaultDaySchedule: DaySchedule = {
  enabled: false,
  start_time: "08:00",
  end_time: "16:00",
};

const emptyForm: ScheduleFormData = {
  doctor_id: null,
  start_date: "",
  end_date: "",
  days_of_week: [],
  start_time: "08:00",
  end_time: "16:00",
  is_active: true,
  daySchedules: {
    0: { ...defaultDaySchedule },
    1: { ...defaultDaySchedule, enabled: true },
    2: { ...defaultDaySchedule, enabled: true },
    3: { ...defaultDaySchedule, enabled: true },
    4: { ...defaultDaySchedule, enabled: true },
    5: { ...defaultDaySchedule, enabled: true },
    6: { ...defaultDaySchedule },
  },
};

export default function SchedulesPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ScheduleFormData>(emptyForm);
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<number | "">("");
  const [generating, setGenerating] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [doctorsRes, schedulesRes] = await Promise.all([
        fetch("/api/admin/doctors"),
        fetch(`/api/admin/schedules${selectedDoctorFilter ? `?doctor_id=${selectedDoctorFilter}` : ""}`),
      ]);
      
      const doctorsData = await doctorsRes.json();
      const schedulesData = await schedulesRes.json();

      if (doctorsData.success) {
        setDoctors(doctorsData.data || []);
      }
      
      if (schedulesData.success) {
        setSchedules(schedulesData.data || []);
      }
    } catch (error) {
      console.error("Hiba az adatok betöltésekor:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDoctorFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctor_id) {
      alert("Válassz orvost!");
      return;
    }

    // Gyűjtsük össze az engedélyezett napokat
    const enabledDays = Object.entries(formData.daySchedules)
      .filter(([, schedule]) => schedule.enabled)
      .map(([day]) => parseInt(day));
    
    if (enabledDays.length === 0) {
      alert("Válassz legalább egy napot!");
      return;
    }

    try {
      // Ha szerkesztés módban vagyunk, a régi módon működik (egy schedule)
      if (editingId) {
        const res = await fetch("/api/admin/schedules", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            doctor_id: formData.doctor_id,
            start_date: formData.start_date,
            end_date: formData.end_date,
            days_of_week: formData.days_of_week,
            start_time: formData.start_time,
            end_time: formData.end_time,
            is_active: formData.is_active,
          }),
        });

        const data = await res.json();
        
        if (data.success) {
          setShowForm(false);
          setEditingId(null);
          setFormData(emptyForm);
          loadData();
          alert("Időbeosztás frissítve!");
        } else {
          alert("Hiba: " + data.error);
        }
        return;
      }

      // Új létrehozás: minden naphoz külön schedule
      let createdCount = 0;
      const errors: string[] = [];

      for (const [dayStr, schedule] of Object.entries(formData.daySchedules)) {
        if (!schedule.enabled) continue;

        const day = parseInt(dayStr);
        const res = await fetch("/api/admin/schedules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctor_id: formData.doctor_id,
            start_date: formData.start_date,
            end_date: formData.end_date,
            days_of_week: [day],
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            is_active: formData.is_active,
          }),
        });

        const data = await res.json();
        
        if (data.success) {
          createdCount++;
        } else {
          errors.push(`${DAYS.find(d => d.value === day)?.label}: ${data.error}`);
        }
      }

      setShowForm(false);
      setFormData(emptyForm);
      loadData();

      if (errors.length > 0) {
        alert(`${createdCount} időbeosztás létrehozva.\n\nHibák:\n${errors.join("\n")}`);
      } else {
        alert(`${createdCount} időbeosztás sikeresen létrehozva!`);
      }
    } catch {
      alert("Hiba történt a mentés során");
    }
  };

  const handleEdit = (schedule: DoctorSchedule) => {
    const days = JSON.parse(schedule.days_of_week) as number[];
    // Szerkesztésnél a régi módot használjuk (egy schedule, azonos idő minden napra)
    const newDaySchedules = { ...emptyForm.daySchedules };
    days.forEach(day => {
      newDaySchedules[day] = {
        enabled: true,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
      };
    });
    
    setEditingId(schedule.id);
    setFormData({
      doctor_id: schedule.doctor_id,
      start_date: schedule.start_date,
      end_date: schedule.end_date,
      days_of_week: days,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      is_active: schedule.is_active === 1,
      daySchedules: newDaySchedules,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Biztosan törölni szeretnéd ezt az időbeosztást? A hozzá generált időpontok is törlődnek (ha nincsenek foglalások).")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/schedules?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      
      if (data.success) {
        loadData();
        alert("Időbeosztás törölve!");
      } else {
        alert("Hiba: " + data.error);
      }
    } catch {
      alert("Hiba történt a törlés során");
    }
  };

  const handleGenerateSlots = async (scheduleId?: number) => {
    if (!selectedDoctorFilter && !scheduleId) {
      alert("Válassz ki egy orvost vagy időbeosztást az időpontok generálásához!");
      return;
    }

    setGenerating(true);
    try {
      const body: { doctor_id?: number; schedule_id?: number } = {};
      
      if (scheduleId) {
        body.schedule_id = scheduleId;
      } else if (selectedDoctorFilter) {
        body.doctor_id = selectedDoctorFilter as number;
      }

      const res = await fetch("/api/admin/generate-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (data.success) {
        alert(`Sikeresen generálva ${data.data.generated} időpont! (${data.data.skipped} kihagyva - már létezett)`);
      } else {
        alert("Hiba: " + data.error);
      }
    } catch {
      alert("Hiba történt a generálás során");
    } finally {
      setGenerating(false);
    }
  };

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      daySchedules: {
        ...prev.daySchedules,
        [day]: {
          ...prev.daySchedules[day],
          enabled: !prev.daySchedules[day].enabled,
        },
      },
    }));
  };

  const updateDayTime = (day: number, field: 'start_time' | 'end_time', value: string) => {
    setFormData(prev => ({
      ...prev,
      daySchedules: {
        ...prev.daySchedules,
        [day]: {
          ...prev.daySchedules[day],
          [field]: value,
        },
      },
    }));
  };

  const formatDays = (daysJson: string) => {
    try {
      const days: number[] = JSON.parse(daysJson);
      return days.map(d => DAYS.find(day => day.value === d)?.short).join(", ");
    } catch {
      return daysJson;
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Időbeosztások</h1>
              <p className="text-gray-600">Orvosok munkaidejének kezelése</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData(emptyForm);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                + Új időbeosztás
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Szűrés és generálás */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orvos szűrő
              </label>
              <select
                value={selectedDoctorFilter}
                onChange={(e) => setSelectedDoctorFilter(e.target.value ? parseInt(e.target.value) : "")}
                className="border border-gray-300 rounded px-3 py-2 w-64"
              >
                <option value="">Összes orvos</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} ({doctor.examination_duration} perc/vizsgálat)
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleGenerateSlots()}
              disabled={generating || !selectedDoctorFilter}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
            >
              {generating ? "Generálás..." : "🔄 Időpontok generálása"}
            </button>
          </div>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? "Időbeosztás szerkesztése" : "Új időbeosztás"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Orvos választó */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orvos *
                  </label>
                  <select
                    value={formData.doctor_id || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctor_id: parseInt(e.target.value) || null }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Válassz orvost...</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dátumtartomány */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kezdő dátum *
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Záró dátum *
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                {/* Napok és időpontok választó */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendelési napok és időpontok *
                  </label>
                  <div className="space-y-2 border border-gray-200 rounded-lg p-3">
                    {DAYS.map(day => (
                      <div key={day.value} className="flex items-center gap-3">
                        <label className="flex items-center gap-2 w-28 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.daySchedules[day.value]?.enabled || false}
                            onChange={() => toggleDay(day.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className={`text-sm ${formData.daySchedules[day.value]?.enabled ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                            {day.label}
                          </span>
                        </label>
                        {formData.daySchedules[day.value]?.enabled && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              pattern="[0-2][0-9]:[0-5][0-9]"
                              placeholder="08:00"
                              value={formData.daySchedules[day.value]?.start_time || "08:00"}
                              onChange={(e) => updateDayTime(day.value, 'start_time', e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm w-20 text-center"
                            />
                            <span className="text-gray-500">–</span>
                            <input
                              type="text"
                              pattern="[0-2][0-9]:[0-5][0-9]"
                              placeholder="16:00"
                              value={formData.daySchedules[day.value]?.end_time || "16:00"}
                              onChange={(e) => updateDayTime(day.value, 'end_time', e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm w-20 text-center"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aktív */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                    Aktív időbeosztás
                  </label>
                </div>

                {/* Gombok */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData(emptyForm);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Mégse
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {editingId ? "Mentés" : "Létrehozás"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Időbeosztások táblázat */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orvos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Időszak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Napok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Óra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Állapot
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Műveletek
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nincs időbeosztás. Hozz létre egyet a gombbal!
                  </td>
                </tr>
              ) : (
                schedules.map(schedule => {
                  const doctor = doctors.find(d => d.id === schedule.doctor_id);
                  return (
                    <tr key={schedule.id} className={schedule.is_active === 0 ? "bg-gray-50 opacity-60" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {doctor?.name || schedule.doctor_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doctor?.specialty}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.start_date} – {schedule.end_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDays(schedule.days_of_week)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.start_time} – {schedule.end_time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          schedule.is_active === 1 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {schedule.is_active === 1 ? "Aktív" : "Inaktív"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleGenerateSlots(schedule.id)}
                          disabled={generating}
                          className="text-green-600 hover:text-green-900 mr-4"
                          title="Időpontok generálása ebből az időbeosztásból"
                        >
                          🔄
                        </button>
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Szerkesztés
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Törlés
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Vissza link */}
        <div className="mt-8">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Vissza az admin főoldalra
          </Link>
        </div>
      </main>
    </div>
  );
}
