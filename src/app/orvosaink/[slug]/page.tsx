import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { doctors, getDoctorBySlug, getAllDoctorSlugs } from "@/data/doctors";
import { contactInfo } from "@/data/contact";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  
  if (!doctor) {
    return { title: "Orvos nem található" };
  }

  return {
    title: `${doctor.name} - ${doctor.specialties.join(", ")}`,
    description: `${doctor.name} ${doctor.title}, ${doctor.specialties.join(", ")} szakorvos a RónaRendelőben. ${doctor.shortBio}`,
  };
}

export async function generateStaticParams() {
  return getAllDoctorSlugs().map((slug) => ({ slug }));
}

export default async function DoctorPage({ params }: Props) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/orvosaink"
          className="inline-flex items-center gap-2 text-rona-600 hover:text-rona-700 mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Vissza az orvosokhoz
        </Link>

        {/* Doctor Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Photo */}
            <div className="md:w-1/3 bg-gradient-to-br from-rona-100 to-rona-200 flex items-center justify-center p-8">
              <div className="w-40 h-40 rounded-full bg-rona-300 flex items-center justify-center">
                <svg className="w-24 h-24 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Info */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {doctor.name}
              </h1>
              <p className="text-rona-600 font-medium mb-4">{doctor.title}</p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-6">
                {doctor.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="bg-rona-100 text-rona-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Schedule */}
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <svg className="w-5 h-5 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Rendelési idő:</span>
                <span>{doctor.schedule}</span>
              </div>

              {/* Languages */}
              {doctor.languages && doctor.languages.length > 0 && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <svg className="w-5 h-5 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="font-medium">Nyelvek:</span>
                  <span>{doctor.languages.join(", ")}</span>
                </div>
              )}

              {/* Website */}
              {doctor.website && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <svg className="w-5 h-5 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a
                    href={`https://${doctor.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rona-600 hover:text-rona-700 transition-colors"
                  >
                    {doctor.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bemutatkozás</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            {doctor.fullBio.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Services */}
        {doctor.services && doctor.services.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Szolgáltatások</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {doctor.services.map((service, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-rona-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
