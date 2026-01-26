-- Időpontfoglaló adatbázis séma
-- Ez a fájl határozza meg a táblák struktúráját

-- Orvosok táblája (ha még nincs, a meglévő adatokból töltjük)
CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,          -- URL-barát név (pl. "dr-kovacs-peter")
    name TEXT NOT NULL,                   -- Teljes név
    specialty TEXT NOT NULL,              -- Szakterület
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Időpontok táblája - az admin itt állítja be a szabad időpontokat
CREATE TABLE IF NOT EXISTS time_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_id INTEGER NOT NULL,
    date DATE NOT NULL,                   -- Dátum (pl. "2026-01-15")
    start_time TIME NOT NULL,             -- Kezdés (pl. "09:00")
    end_time TIME NOT NULL,               -- Vége (pl. "09:30")
    is_available INTEGER DEFAULT 1,       -- 1 = szabad, 0 = foglalt
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Foglalások táblája - a páciensek foglalásai
CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time_slot_id INTEGER NOT NULL,        -- Melyik időpont
    patient_name TEXT NOT NULL,           -- Páciens neve
    patient_email TEXT NOT NULL,          -- Páciens email
    patient_phone TEXT NOT NULL,          -- Páciens telefon
    notes TEXT,                           -- Megjegyzés (opcionális)
    status TEXT DEFAULT 'pending',        -- pending, confirmed, cancelled
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (time_slot_id) REFERENCES time_slots(id)
);

-- Admin felhasználók (egyszerű jelszavas bejelentkezés)
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,          -- Hashelt jelszó
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Felhasználók tábla (autentikáció és jogosultságok)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,          -- bcrypt hashelt jelszó
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',    -- user, admin, doctor, superadmin
    doctor_id INTEGER,                    -- Ha orvos szerepkör, melyik orvoshoz tartozik
    is_active INTEGER DEFAULT 1,          -- 1 = aktív, 0 = inaktív
    failed_login_attempts INTEGER DEFAULT 0,
    last_failed_login DATETIME,
    locked_until DATETIME,                -- Fiók zárolás ideje
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Index a gyors kereséshez
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date);
CREATE INDEX IF NOT EXISTS idx_time_slots_doctor ON time_slots(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
