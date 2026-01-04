import Link from "next/link";
import Image from "next/image";
import { Doctor } from "@/data/doctors";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link href={`/orvosaink/${doctor.id}`} className="group h-full">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 p-5 h-full flex flex-col">
        <div className="flex items-start gap-4">
          {/* Small oval photo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-20 rounded-full bg-gradient-to-br from-rona-100 to-rona-200 flex items-center justify-center overflow-hidden">
              {/* Placeholder - later replace with actual image */}
              <svg className="w-10 h-10 text-rona-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {/* Uncomment when images are available:
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={64}
                height={80}
                className="object-cover w-full h-full"
              />
              */}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-rona-600 transition-colors truncate">
              {doctor.name}
            </h3>
            <p className="text-rona-600 text-sm font-medium mb-2">{doctor.title}</p>
            
            {/* Specialties */}
            <div className="flex flex-wrap gap-1 mb-2">
              {doctor.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>

            {/* Schedule */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">{doctor.schedule}</span>
            </div>
          </div>
        </div>

        {/* Short bio */}
        <p className="text-gray-600 text-sm line-clamp-2 mt-3 flex-grow">{doctor.shortBio}</p>

        {/* CTA */}
        <div className="mt-3 flex items-center text-rona-600 font-medium text-sm group-hover:text-rona-700">
          <span>Részletek</span>
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
