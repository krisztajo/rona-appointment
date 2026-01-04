import { Metadata } from "next";
import { doctors } from "@/data/doctors";
import DoctorCard from "@/components/DoctorCard";

export const metadata: Metadata = {
  title: "Orvosaink",
  description: "A RónaRendelő szakorvosai: bőrgyógyász, ortopéd, urológus, sebész szakorvosok. Ismerje meg tapasztalt orvosainkat és szakterületeiket.",
};

export default function OrvosainkPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Orvosaink
          </h1>
          <div className="w-20 h-1 bg-rona-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Tapasztalt, elismert szakorvosok, akik kórházi munkájuk mellett 
            a RónaRendelőben is várják Önt.
          </p>
        </div>

        {/* Doctor Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-rona-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Időpontfoglalás
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Válassza ki az Önnek megfelelő szakorvost, majd hívjon minket az időpontegyeztetéshez.
          </p>
          <a
            href="tel:+36307476298"
            className="inline-flex items-center gap-2 bg-rona-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rona-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            06 30 747 6298
          </a>
        </div>
      </div>
    </div>
  );
}
