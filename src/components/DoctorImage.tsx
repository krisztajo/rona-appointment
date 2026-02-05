"use client";

import { useState } from "react";

interface DoctorImageProps {
  src?: string;
  alt: string;
  size: "small" | "large";
}

export default function DoctorImage({ src, alt, size }: DoctorImageProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    small: "w-16 h-20",
    large: "w-40 h-40"
  };

  const iconSizes = {
    small: "w-10 h-10",
    large: "w-24 h-24"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-rona-100 to-rona-200 flex items-center justify-center overflow-hidden`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full"
          onError={() => setImageError(true)}
        />
      ) : (
        <svg 
          className={`${iconSizes[size]} text-rona-600`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )}
    </div>
  );
}