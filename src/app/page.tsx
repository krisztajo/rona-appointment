import Link from "next/link";
import { doctors } from "@/data/doctors";
import { contactInfo } from "@/data/contact";
import DoctorCard from "@/components/DoctorCard";
import {
  DermatologyIcon,
  OrthopedicsIcon,
  TraumatologyIcon,
  UrologyIcon,
  SurgeryIcon,
  UltrasoundIcon,
} from "@/components/icons/ServiceIcons";

export default function Home() {
  // Show first 4 doctors on homepage
  const featuredDoctors = doctors.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-rona-50 text-gray-900">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Szakorvosi ellátás<br />
              <span className="text-rona-500">nyugodt körülmények között</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              A RónaRendelő-ben elismert szakorvosok várják Önt kiszámítható időponttal, 
              személyre szabott törődéssel, a legmagasabb szakmai színvonalon.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/orvosaink"
                className="inline-flex items-center gap-2 bg-rona-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rona-700 transition-colors shadow-lg"
              >
                Orvosaink
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/szolgaltatasok"
                className="inline-flex items-center gap-2 border-2 border-rona-600 text-rona-700 px-6 py-3 rounded-lg font-semibold hover:bg-rona-600 hover:text-white transition-colors"
              >
                Szolgáltatások
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section - Rólunk */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Miért a RónaRendelő?
            </h2>
            <div className="w-20 h-1 bg-rona-600 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Orvosaink szinte kivétel nélkül a mindennapi betegellátásban dolgoznak, 
              mind a szakmájuk, mind a betegek által elismerten. Sajnos a kórházi sikeresség 
              automatikusan a betegforgalom megemelkedését, néha már a betegek által nehezen 
              tolerálható várakozást jelenti.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Ezen felül, a mindennapi munka melletti kórházi körülmények nem mindig alkalmasak 
              a betegek egy részének sokat jelentő, <strong>kiszámítható vizsgálati idő</strong> tartására.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              A <strong>„RónaRendelő"-t</strong> évekkel ezelőtt azon megfontolások alapján hoztuk létre, 
              hogy olyan betegeknek kínáljunk alternatívát, akiknek sokat jelent a <strong>nyugodt 
              környezet</strong>, a <strong>kiszámítható időpont</strong> és a <strong>személyes törődés</strong>.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rona-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Elismert szakorvosok</h3>
              <p className="text-gray-600 text-sm">Kórházi tapasztalattal rendelkező, elismert specialisták</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rona-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kiszámítható időpont</h3>
              <p className="text-gray-600 text-sm">Pontos időpontok, minimális várakozási idő</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rona-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Személyes törődés</h3>
              <p className="text-gray-600 text-sm">Egyénre szabott figyelem és gondoskodás</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rona-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Nyugodt környezet</h3>
              <p className="text-gray-600 text-sm">Modern, klimatizált rendelő kellemes légkörben</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Szakterületeink
            </h2>
            <div className="w-20 h-1 bg-rona-600 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Széles körű szakorvosi ellátás egy helyen
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Bőrgyógyászat", icon: DermatologyIcon, desc: "Anyajegyszűrés, bőrbetegségek, kozmetológia" },
              { name: "Ortopédia", icon: OrthopedicsIcon, desc: "Mozgásszervi betegségek, sportsérülések" },
              { name: "Traumatológia", icon: TraumatologyIcon, desc: "Baleseti sebészet, töréskezelés" },
              { name: "Urológia", icon: UrologyIcon, desc: "Urológiai vizsgálatok és kezelések" },
              { name: "Sebészet", icon: SurgeryIcon, desc: "Általános és onkosebészet" },
              { name: "UH Diagnosztika", icon: UltrasoundIcon, desc: "Ultrahang vizsgálatok" },
            ].map((specialty) => (
              <Link
                key={specialty.name}
                href="/szolgaltatasok"
                className="bg-white p-6 rounded-xl shadow-sm border-2 border-transparent hover:border-rona-400 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="transition-transform duration-200 group-hover:scale-110 inline-block">
                  <specialty.icon size={40} className="text-rona-500 group-hover:text-rona-600 transition-colors mb-4" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-rona-600 transition-colors mb-2">
                  {specialty.name}
                </h3>
                <p className="text-gray-600 text-sm">{specialty.desc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/szolgaltatasok"
              className="inline-flex items-center gap-2 text-rona-600 font-semibold hover:text-rona-700 transition-colors"
            >
              Összes szolgáltatás és árak
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Orvosaink
            </h2>
            <div className="w-20 h-1 bg-rona-600 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tapasztalt, elismert szakorvosok csapata
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/orvosaink"
              className="inline-flex items-center gap-2 bg-rona-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rona-700 transition-colors"
            >
              Összes orvosunk
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-rona-600 to-rona-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Kérjen időpontot még ma!
              </h2>
              <p className="text-rona-100 text-lg mb-8">
                Hívjon minket vagy írjon e-mailt, és kollégáink segítenek 
                megtalálni az Önnek legmegfelelőbb időpontot.
              </p>
              <div className="space-y-4">
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-xl hover:text-rona-200 transition-colors"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-semibold">{contactInfo.phone}</span>
                </a>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 text-xl hover:text-rona-200 transition-colors"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-semibold">{contactInfo.email}</span>
                </a>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="font-semibold text-xl mb-4">Elérhetőség</h3>
              <div className="space-y-4 text-rona-100">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white">Cím</p>
                    <p>{contactInfo.address.zip} {contactInfo.address.city}</p>
                    <p>{contactInfo.address.street}, {contactInfo.address.floor}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white">Megközelítés</p>
                    <p>Uzsoki Kórházzal szemben, 82-es troli végállomás mellett</p>
                    <p>Parkolási lehetőség a rendelő előtt</p>
                  </div>
                </div>
              </div>
              <Link
                href="/kapcsolat"
                className="mt-6 inline-flex items-center gap-2 bg-white text-rona-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-rona-50 transition-colors"
              >
                Részletes térkép
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
