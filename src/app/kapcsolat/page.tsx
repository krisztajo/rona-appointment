import { Metadata } from "next";
import { contactInfo } from "@/data/contact";
import { doctors } from "@/data/doctors";

export const metadata: Metadata = {
  title: "Kapcsolat",
  description: "RónaRendelő elérhetőségei. Cím: Budapest XIV. kerület, Róna utca 183. Telefon: 06 30 747 6298. Időpontfoglalás és megközelítés.",
};

export default function KapcsolatPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Kapcsolat
          </h1>
          <div className="w-20 h-1 bg-rona-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Keresse fel rendelőnket, vagy hívjon minket az időpontfoglaláshoz!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Phone */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-rona-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                Telefonos időpontkérés
              </h2>
              <div className="space-y-3">
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-xl font-semibold text-rona-600 hover:text-rona-700 transition-colors"
                >
                  {contactInfo.phone}
                </a>
                <p className="text-gray-600 text-sm">
                  <strong>Másodlagos szám:</strong> {contactInfo.phoneSecondary}
                  <br />
                  <span className="text-gray-500">(rendelési idő alatt hívható, vagy üzenetrögzítő)</span>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-rona-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                E-mail
              </h2>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-xl font-semibold text-rona-600 hover:text-rona-700 transition-colors"
              >
                {contactInfo.email}
              </a>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-rona-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Cím
              </h2>
              <address className="not-italic text-gray-700 text-lg mb-4">
                <strong>{contactInfo.address.zip} {contactInfo.address.city}</strong>
                <br />
                {contactInfo.address.street}, {contactInfo.address.floor}
              </address>
              <p className="text-gray-600">
                {contactInfo.mapDescription}
              </p>
            </div>

            {/* Parking & Access */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-rona-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                Megközelítés
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong className="text-gray-800">Tömegközlekedéssel:</strong><br />
                  82-es troli végállomás mellett, Uzsoki Kórházzal szemben
                </p>
                <p>
                  <strong className="text-gray-800">Autóval:</strong><br />
                  {contactInfo.parking}
                </p>
                <p>
                  <strong className="text-gray-800">Rendelő:</strong><br />
                  {contactInfo.climate}
                </p>
              </div>
            </div>

            {/* Facebook */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-rona-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-rona-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                Facebook
              </h2>
              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-rona-600 hover:text-rona-700 transition-colors font-medium"
              >
                Kövessen minket Facebookon
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Map & Schedule */}
          <div className="space-y-8">
            {/* Google Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2694.5!2d19.1148!3d47.5168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dc6a1d93f4b7%3A0x0!2zUsOzbmEgdXRjYSAxODMsIEJ1ZGFwZXN0!5e0!3m2!1shu!2shu!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RónaRendelő térkép"
                ></iframe>
              </div>
              <div className="p-4 text-center">
                <a
                  href="https://maps.google.com/?q=Budapest,+Róna+utca+183"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-rona-600 hover:text-rona-700 transition-colors font-medium"
                >
                  Megnyitás Google Térképen
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-10 h-10 bg-rona-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Rendelési idők
              </h2>
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-gray-500">{doctor.specialties[0]}</p>
                    </div>
                    <p className="text-sm text-rona-600 font-medium text-right">
                      {doctor.schedule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
