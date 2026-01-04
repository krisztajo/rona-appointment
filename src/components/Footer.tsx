import Link from "next/link";
import { contactInfo } from "@/data/contact";

export default function Footer() {
  return (
    <footer className="bg-rona-50 text-rona-900 border-t border-rona-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-rona-200 rounded-lg flex items-center justify-center">
                <span className="text-rona-700 font-bold text-xl">R</span>
              </div>
              <span className="text-xl font-bold text-rona-800">RónaRendelő</span>
            </div>
            <p className="text-rona-700 text-sm">
              Szakorvosi magánrendelő Budapest XIV. kerületében. 
              Elismert szakorvosok, nyugodt környezet, kiszámítható időpontok.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-rona-800">Gyors linkek</h3>
            <ul className="space-y-2 text-rona-700">
              <li>
                <Link href="/" className="hover:text-rona-500 transition-colors">
                  Főoldal
                </Link>
              </li>
              <li>
                <Link href="/orvosaink" className="hover:text-rona-500 transition-colors">
                  Orvosaink
                </Link>
              </li>
                <li>
                  <Link href="/rolunk" className="hover:text-rona-500 transition-colors">
                    Rólunk
                  </Link>
                </li>
              <li>
                <Link href="/szolgaltatasok" className="hover:text-rona-500 transition-colors">
                  Árak & Szolgáltatások
                </Link>
              </li>
              <li>
                <Link href="/kapcsolat" className="hover:text-rona-500 transition-colors">
                  Kapcsolat
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-rona-800">Kapcsolat</h3>
            <ul className="space-y-3 text-rona-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-rona-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  {contactInfo.address.zip} {contactInfo.address.city}<br />
                  {contactInfo.address.street}, {contactInfo.address.floor}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rona-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="hover:text-rona-400 transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rona-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-rona-400 transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rona-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-rona-400 transition-colors">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-rona-200 mt-8 pt-8 text-center text-rona-600 text-sm">
          <p>&copy; {new Date().getFullYear()} RónaRendelő. Minden jog fenntartva.</p>
        </div>
      </div>
    </footer>
  );
}
