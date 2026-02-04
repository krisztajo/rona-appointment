// WhiteLab official logo SVG React component
// Source: provided image (converted to SVG)
import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

const defaultSize = 32;

export const WhiteLabLogoIcon: React.FC<IconProps> = ({ className = "", size = defaultSize }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="200" height="200" rx="40" fill="url(#pink)" />
    <circle cx="44" cy="90" r="20" fill="#fff" />
    <circle cx="100" cy="120" r="20" fill="#fff" />
    <circle cx="156" cy="44" r="20" fill="#fff" />
    <circle cx="156" cy="156" r="20" fill="#fff" />
    <path d="M44 90 Q72 120 100 120 Q128 120 156 156" stroke="#fff" strokeWidth="24" fill="none" strokeLinecap="round" />
    <defs>
      <linearGradient id="pink" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop stop-color="#d32378" />
        <stop offset="1" stop-color="#b9006e" />
      </linearGradient>
    </defs>
  </svg>
);

export default WhiteLabLogoIcon;
