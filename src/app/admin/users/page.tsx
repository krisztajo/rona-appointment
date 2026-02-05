// Felhasználók kezelése - Superadmin oldal
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRequireAdmin } from "@/contexts/AuthContext";
import { UserPublic, UserRole } from "@/types/database";

interface UserWithDoctor extends UserPublic {
  doctor_name?: string;
}

interface DoctorOption {
  id: number;
  name: string;
}

export default function UsersPage() {
  const { user, token, isLoading: authLoading } = useRequireAdmin("/auth/login");
  
  const [users, setUsers] = useState<UserWithDoctor[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithDoctor | null>(null);
  
  // Form state
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("user");
  const [formDoctorId, setFormDoctorId] = useState<number | null>(null);
  const [formIsActive, setFormIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Csak superadmin férhet hozzá
  const isSuperadmin = user?.role === "superadmin";

  const loadData = useCallback(async () => {
    if (!token) return;
    
    try {
      // Felhasználók betöltése
      const usersRes = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersRes.json();
      
      if (usersData.success) {
        setUsers(usersData.data);
      } else {
        setError(usersData.error);
      }

      // Orvosok betöltése
      const doctorsRes = await fetch("/api/admin/doctors");
      const doctorsData = await doctorsRes.json();
      
      if (doctorsData.success) {
        setDoctors(doctorsData.data);
      }
    } catch {
      setError("Hiba az adatok betöltésekor");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && user && isSuperadmin) {
      loadData();
    }
  }, [authLoading, user, isSuperadmin, loadData]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormEmail("");
    setFormPassword("");
    setFormName("");
    setFormRole("user");
    setFormDoctorId(null);
    setFormIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (u: UserWithDoctor) => {
    setEditingUser(u);
    setFormEmail(u.email);
    setFormPassword("");
    setFormName(u.name);
    setFormRole(u.role);
    setFormDoctorId(u.doctor_id);
    setFormIsActive(u.is_active === 1);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setSubmitting(true);
    setError("");

    try {
      if (editingUser) {
        // Módosítás
        const updateData: Record<string, unknown> = {
          name: formName,
          role: formRole,
          doctor_id: formRole === "doctor" ? formDoctorId : null,
          is_active: formIsActive ? 1 : 0,
        };

        if (formEmail !== editingUser.email) {
          updateData.email = formEmail;
        }

        const res = await fetch(`/api/admin/users?id=${editingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });

        const data = await res.json();
        if (!data.success) {
          setError(data.error);
          return;
        }
      } else {
        // Létrehozás
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: formEmail,
            password: formPassword,
            name: formName,
            role: formRole,
            doctor_id: formRole === "doctor" ? formDoctorId : undefined,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          setError(data.error);
          return;
        }
      }

      setShowModal(false);
      loadData();
    } catch {
      setError("Hiba történt a mentés során");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Biztosan törölni szeretné ezt a felhasználót?")) return;
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert(data.error);
      }
    } catch {
      alert("Hiba történt a törlés során");
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "doctor":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case "superadmin":
        return "Szuperadmin";
      case "admin":
        return "Admin";
      case "doctor":
        return "Orvos";
      default:
        return "Felhasználó";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Betöltés...</div>
      </div>
    );
  }

  if (!isSuperadmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Nincs jogosultsága
          </h1>
          <p className="text-gray-600 mb-4">
            Ez az oldal csak szuperadminisztrátorok számára érhető el.
          </p>
          <Link href="/admin" className="text-rona-600 hover:text-rona-700">
            Vissza az admin oldalra
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Felhasználók kezelése</h1>
            <p className="text-gray-600 mt-1">Felhasználók, szerepkörök és jogosultságok</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Vissza
            </Link>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rona-600 hover:bg-rona-700"
            >
              + Új felhasználó
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Users table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Felhasználó
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Szerepkör
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orvos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Státusz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Regisztráció
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Műveletek
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(u.role)}`}>
                      {getRoleName(u.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.doctor_name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      u.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {u.is_active ? "Aktív" : "Inaktív"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(u.created_at).toLocaleDateString("hu-HU")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(u)}
                      className="text-rona-600 hover:text-rona-900 mr-4"
                    >
                      Szerkesztés
                    </button>
                    {u.id !== user?.id && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Törlés
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nincs felhasználó az adatbázisban
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? "Felhasználó szerkesztése" : "Új felhasználó"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Név</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rona-500 focus:border-rona-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rona-500 focus:border-rona-500"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jelszó</label>
                  <input
                    type="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rona-500 focus:border-rona-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Legalább 8 karakter, 1 nagybetű, 1 kisbetű és 1 szám
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Szerepkör</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rona-500 focus:border-rona-500"
                >
                  <option value="user">Felhasználó</option>
                  <option value="admin">Adminisztrátor</option>
                  <option value="doctor">Orvos</option>
                  <option value="superadmin">Szuperadminisztrátor</option>
                </select>
              </div>

              {formRole === "doctor" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Orvos</label>
                  <select
                    value={formDoctorId || ""}
                    onChange={(e) => setFormDoctorId(e.target.value ? parseInt(e.target.value) : null)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rona-500 focus:border-rona-500"
                  >
                    <option value="">Válasszon orvost...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {editingUser && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="h-4 w-4 text-rona-600 focus:ring-rona-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Aktív fiók
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Mégse
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-rona-600 rounded-md hover:bg-rona-700 disabled:bg-gray-400"
                >
                  {submitting ? "Mentés..." : "Mentés"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
