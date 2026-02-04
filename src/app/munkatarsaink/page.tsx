import { Metadata } from "next";
import { doctors } from "@/data/doctors";
import StaffCard from "@/components/StaffCard";

export const metadata: Metadata = {
  title: "Munkatársaink",
  description: "A RónaRendelő munkatársai: szakorvosok és ügyfélszolgálati asszisztensek. Ismerje meg tapasztalt csapatunkat.",
};

export default function MunkatarsainkPage() {
  const doctorsOnly = doctors.filter(staff => staff.staffType === "doctor");
  const assistants = doctors.filter(staff => staff.staffType === "assistant");

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Munkatársaink
          </h1>
          <div className="w-20 h-1 bg-rona-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Tapasztalt, elismert szakorvosok és elkötelezett asszisztenseink, 
            akik a legmagasabb színvonalú ellátást biztosítják Önnek.
          </p>
        </div>

        {/* Doctors Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <svg className="w-8 h-8 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Orvosaink
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctorsOnly.map((doctor) => (
              <StaffCard key={doctor.id} staff={doctor} />
            ))}
          </div>
        </div>

        {/* Assistants Section */}
        {assistants.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <svg className="w-8 h-8 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Asszisztenseink
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {assistants.map((assistant) => (
                <StaffCard key={assistant.id} staff={assistant} />
              ))}
            </div>
          </div>
        )}

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
