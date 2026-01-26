// Adatbázis típusok az időpontfoglaló rendszerhez

export interface Doctor {
  id: number;
  slug: string;
  name: string;
  specialty: string;
  examination_duration: number; // vizsgálat időtartama percben (15, 20, 30, stb.)
  created_at: string;
}

// Orvos beosztás (ismétlődő időszakok)
export interface DoctorSchedule {
  id: number;
  doctor_id: number;
  start_date: string;      // "2026-01-10" - időszak kezdete
  end_date: string;        // "2026-02-15" - időszak vége
  days_of_week: string;    // "1,3,5" - hétfő, szerda, péntek (0=vasárnap, 1=hétfő...)
  start_time: string;      // "08:00" - napi kezdés
  end_time: string;        // "12:00" - napi befejezés
  is_active: number;       // 1 vagy 0
  created_at: string;
}

// DoctorSchedule orvos adatokkal
export interface DoctorScheduleWithDoctor extends DoctorSchedule {
  doctor_name: string;
  doctor_specialty: string;
}

export interface TimeSlot {
  id: number;
  doctor_id: number;
  schedule_id: number | null; // melyik beosztásból generálódott
  date: string;        // "2026-01-15" formátum
  start_time: string;  // "09:00" formátum
  end_time: string;    // "09:30" formátum
  is_available: number; // 1 vagy 0 (SQLite nem támogat boolean-t)
  created_at: string;
}

// TimeSlot orvos adatokkal kiegészítve
export interface TimeSlotWithDoctor extends TimeSlot {
  doctor_name: string;
  doctor_specialty: string;
}

export interface Appointment {
  id: number;
  time_slot_id: number;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

// Appointment minden adattal (JOIN-olt)
export interface AppointmentFull extends Appointment {
  doctor_name: string;
  doctor_specialty: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface Admin {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

// API request/response típusok
export interface CreateTimeSlotRequest {
  doctor_id: number;
  date: string;
  start_time: string;
  end_time: string;
}

export interface CreateAppointmentRequest {
  time_slot_id: number;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  notes?: string;
}

// Beosztás létrehozás
export interface CreateScheduleRequest {
  doctor_id: number;
  start_date: string;
  end_date: string;
  days_of_week: number[];  // [1, 3, 5] = hétfő, szerda, péntek
  start_time: string;
  end_time: string;
}

// Időpont generálás kérés
export interface GenerateSlotsRequest {
  doctor_id: number;
  schedule_id?: number;    // opcionális: csak egy beosztásból generál
  from_date?: string;      // opcionális: ettől a dátumtól
  to_date?: string;        // opcionális: eddig a dátumig
}

// Hét napjai segédtípus
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Vasárnap', short: 'V' },
  { value: 1, label: 'Hétfő', short: 'H' },
  { value: 2, label: 'Kedd', short: 'K' },
  { value: 3, label: 'Szerda', short: 'Sze' },
  { value: 4, label: 'Csütörtök', short: 'Cs' },
  { value: 5, label: 'Péntek', short: 'P' },
  { value: 6, label: 'Szombat', short: 'Szo' },
] as const;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// Felhasználói autentikáció típusok
// ============================================

// Felhasználói szerepkörök
export type UserRole = 'user' | 'admin' | 'doctor' | 'superadmin';

// Felhasználó adatbázis rekord
export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  doctor_id: number | null;  // Ha orvos, melyik orvoshoz tartozik
  is_active: number;         // 1 = aktív, 0 = inaktív
  failed_login_attempts: number;
  last_failed_login: string | null;
  locked_until: string | null;
  created_at: string;
  updated_at: string;
}

// Felhasználó publikus adatai (jelszó nélkül)
export interface UserPublic {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  doctor_id: number | null;
  is_active: number;
  created_at: string;
}

// Regisztrációs kérés
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Bejelentkezési kérés
export interface LoginRequest {
  email: string;
  password: string;
}

// Jelszó változtatás kérés
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// Felhasználó létrehozás (admin által)
export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  doctor_id?: number;
}

// Felhasználó módosítás
export interface UpdateUserRequest {
  email?: string;
  name?: string;
  role?: UserRole;
  doctor_id?: number | null;
  is_active?: number;
}

// Auth válasz (bejelentkezés/regisztráció után)
export interface AuthResponse {
  user: UserPublic;
  token: string;
}
