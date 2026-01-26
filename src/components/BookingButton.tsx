// Időpontfoglalás gomb - auth állapot alapján
"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface BookingButtonProps {
  slug: string;
}

export default function BookingButton({ slug }: BookingButtonProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium cursor-not-allowed">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Betöltés...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Link
        href={`/orvosaink/${slug}/foglalas`}
        className="inline-flex items-center gap-2 bg-rona-500 text-white px-6 py-3 rounded-lg hover:bg-rona-600 transition-colors font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Időpontfoglalás
      </Link>
    );
  }

  // Nem bejelentkezett felhasználó
  return (
    <div className="space-y-3">
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 bg-rona-500 text-white px-6 py-3 rounded-lg hover:bg-rona-600 transition-colors font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Időpontfoglalás
      </Link>
      <p className="text-sm text-gray-500">
        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Időpontfoglaláshoz bejelentkezés szükséges
      </p>
    </div>
  );
}
