"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { contactInfo } from "@/data/contact";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Főoldal", href: "/" },
  { name: "Rólunk", href: "/rolunk" },
  { name: "Orvosaink", href: "/orvosaink" },
  { name: "Árak & Szolgáltatások", href: "/szolgaltatasok" },
  { name: "Kapcsolat", href: "/kapcsolat" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Contact Bar */}
      <div className="bg-rona-700 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-2 text-sm">
            <div className="flex items-center gap-4">
              <span className="text-rona-100">Időpont kérés:</span>
              <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="flex items-center gap-1 hover:text-rona-200 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium">{contactInfo.phone}</span>
              </a>
              <span className="hidden sm:inline text-rona-300">•</span>
              <span className="hidden sm:inline text-rona-100">E-mail:</span>
              <a href={`mailto:${contactInfo.email}`} className="hidden sm:flex items-center gap-1 hover:text-rona-200 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{contactInfo.email}</span>
              </a>
            </div>
            {/* Facebook icon */}
            <a
              href="https://www.facebook.com/profile.php?id=100011537070348"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rona-200 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="RónaRendelő - ...tudjuk, szeretjük!"
              width={120}
              height={100}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-rona-600 font-medium text-lg transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* Auth Links */}
            {!isLoading && (
              isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-rona-600 font-medium transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-rona-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b">
                          {user.email}
                        </div>
                        <Link
                          href="/auth/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Profil
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Admin felület
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Kijelentkezés
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rona-600 hover:bg-rona-700 transition-colors"
                >
                  Bejelentkezés
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-rona-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Links */}
              {!isLoading && (
                isAuthenticated && user ? (
                  <>
                    <div className="border-t pt-4 mt-2">
                      <div className="text-sm text-gray-500 mb-2">{user.email}</div>
                      <Link
                        href="/auth/profile"
                        className="block text-gray-700 hover:text-rona-600 font-medium transition-colors mb-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profil
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="block text-gray-700 hover:text-rona-600 font-medium transition-colors mb-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Admin felület
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        Kijelentkezés
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t pt-4 mt-2">
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rona-600 hover:bg-rona-700 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Bejelentkezés
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
