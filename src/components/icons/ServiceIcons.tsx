// Egységes ikon készlet a szolgáltatásokhoz
// Stílus: letisztult, flat design, azonos vonalvastagság (2px), lekerekített sarkok, árnyék nélkül
// Színpaletta: currentColor (öröklődik a szülőtől)

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

const defaultSize = 32;
const strokeWidth = 2;

// Bőrgyógyászat - Mikroszkóp/nagyító bőrrel
export const DermatologyIcon: React.FC<IconProps> = ({ className = "", size = defaultSize }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Nagyító */}
    <circle cx="14" cy="14" r="8" />
    <line x1="20" y1="20" x2="27" y2="27" />
    {/* Bőrrétegek */}
    <path d="M10 12 Q12 11, 14 12 Q16 13, 18 12" />
    <path d="M10 15 Q12 14, 14 15 Q16 16, 18 15" />
  </svg>
);

// Ortopédia - Csont
export const OrthopedicsIcon: React.FC<IconProps> = ({ className = "", size = defaultSize }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Csont forma */}
    <path d="M8 6 Q4 6, 4 9 Q4 12, 8 12 L8 20 Q4 20, 4 23 Q4 26, 8 26 Q10 26, 10 23 L10 9 Q10 6, 8 6" />
    <path d="M24 6 Q28 6, 28 9 Q28 12, 24 12 L24 20 Q28 20, 28 23 Q28 26, 24 26 Q22 26, 22 23 L22 9 Q22 6, 24 6" />
    <rect x="10" y="13" width="12" height="6" rx="1" />
  </svg>
);

// Urológia - Vese
export const UrologyIcon: React.FC<IconProps> = ({ className = "", size = defaultSize }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Vese forma */}
    <path d="M8 8 Q4 10, 4 16 Q4 22, 8 24 Q12 26, 16 24 Q14 20, 14 16 Q14 12, 16 8 Q12 6, 8 8" />
    <path d="M24 8 Q28 10, 28 16 Q28 22, 24 24 Q20 26, 16 24 Q18 20, 18 16 Q18 12, 16 8 Q20 6, 24 8" />
  </svg>
);

// Általános Sebészet - Szike
export const SurgeryIcon: React.FC<IconProps> = ({ className = "", size = defaultSize }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Szike */}
    <path d="M6 26 L14 18" />
    <path d="M14 18 L20 12 Q22 10, 24 8 L26 6" />
    <path d="M14 18 L16 20 Q18 22, 16 24 L14 26 Q12 28, 10 26 L8 24 Q6 22, 8 20 L10 18" />
    {/* Markolat */}
    <line x1="6" y1="26" x2="4" y2="28" />
  </svg>
);

// UH Diagnosztika - Ultrahang fejegység
export const UltrasoundIcon: React.FC<IconProps> = ({ className = "", size = defaultSize }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Ultrahang fejegység */}
    <rect x="10" y="4" width="12" height="20" rx="6" />
    {/* Kábel */}
    <path d="M16 24 L16 28" />
    <path d="M14 28 L18 28" />
    {/* Hullámok */}
    <path d="M6 10 Q4 14, 6 18" />
    <path d="M26 10 Q28 14, 26 18" />
    <path d="M3 8 Q0 14, 3 20" />
    <path d="M29 8 Q32 14, 29 20" />
  </svg>
);

// Gyermeksebészet - Gyermek figura
export const PediatricSurgeryIcon: React.FC<IconProps> = ({ className = "", size = defaultSize }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Fej */}
    <circle cx="16" cy="8" r="5" />
    {/* Test */}
    <path d="M16 13 L16 20" />
    {/* Karok */}
    <path d="M16 15 L10 18" />
    <path d="M16 15 L22 18" />
    {/* Lábak */}
    <path d="M16 20 L12 28" />
    <path d="M16 20 L20 28" />
    {/* Kis szív a mellkason */}
    <path d="M14 16 Q14 15, 15 15 Q16 15, 16 16 Q16 15, 17 15 Q18 15, 18 16 Q18 17, 16 19 Q14 17, 14 16" />
  </svg>
);

// Traumatológia - Kötszer/ragtapasz
export const TraumatologyIcon: React.FC<IconProps> = ({ className = "", size = defaultSize }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Ragtapasz forma */}
    <rect x="4" y="11" width="24" height="10" rx="2" />
    {/* Közép rész */}
    <rect x="11" y="11" width="10" height="10" />
    {/* Lyukak a közepén */}
    <circle cx="14" cy="14" r="1" />
    <circle cx="18" cy="14" r="1" />
    <circle cx="14" cy="18" r="1" />
    <circle cx="18" cy="18" r="1" />
    <circle cx="16" cy="16" r="1" />
  </svg>
);

// Ikon mapping az ID-k alapján
export const serviceIconMap: Record<string, React.FC<IconProps>> = {
  borgyogyaszat: DermatologyIcon,
  ortopedia: OrthopedicsIcon,
  urologia: UrologyIcon,
  sebeszet: SurgeryIcon,
  ultrahang: UltrasoundIcon,
  gyermeksebeszet: PediatricSurgeryIcon,
  traumatologia: TraumatologyIcon,
};

// Univerzális ServiceIcon komponens
export const ServiceIcon: React.FC<IconProps & { serviceId: string }> = ({
  serviceId,
  className = "",
  size = defaultSize,
}) => {
  const IconComponent = serviceIconMap[serviceId];
  
  if (!IconComponent) {
    // Alapértelmezett ikon, ha nincs találat
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="16" cy="16" r="12" />
        <line x1="16" y1="10" x2="16" y2="16" />
        <line x1="16" y1="16" x2="20" y2="20" />
      </svg>
    );
  }

  return <IconComponent className={className} size={size} />;
};

export default ServiceIcon;
