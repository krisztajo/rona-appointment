import Link from "next/link";
import { StaffMember } from "@/data/doctors";
import DoctorImage from "./DoctorImage";

interface StaffCardProps {
  staff: StaffMember;
  linkPrefix?: string;
}

export default function StaffCard({ staff, linkPrefix = "/munkatarsaink" }: StaffCardProps) {
  const isDoctor = staff.staffType === "doctor";
  const href = isDoctor ? `${linkPrefix}/${staff.id}` : "#";
  
  const CardContent = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 p-5 h-full flex flex-col">
      <div className="flex items-start gap-4">
        {/* Photo */}
        <div className="flex-shrink-0">
          <DoctorImage src={staff.image} alt={staff.name} size="small" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-rona-600 transition-colors truncate">
            {staff.name}
          </h3>
          <p className="text-rona-600 text-sm font-medium mb-2">{staff.title}</p>
          
          {/* For doctors: show specialties */}
          {isDoctor && staff.specialties && staff.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {staff.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}

          {/* Schedule */}
          {staff.schedule && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">{staff.schedule}</span>
            </div>
          )}
        </div>
      </div>

      {/* Short bio - only for doctors */}
      {isDoctor && staff.shortBio && (
        <p className="text-gray-600 text-sm line-clamp-2 mt-3 flex-grow">{staff.shortBio}</p>
      )}

      {/* CTA - only for doctors */}
      {isDoctor && (
        <div className="mt-3 flex items-center text-rona-600 font-medium text-sm group-hover:text-rona-700">
          <span>Részletek</span>
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );

  // For doctors, wrap in Link. For assistants, just render the card
  return isDoctor ? (
    <Link href={href} className="group h-full">
      <CardContent />
    </Link>
  ) : (
    <div className="h-full">
      <CardContent />
    </div>
  );
}
