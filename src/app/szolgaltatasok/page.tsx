"use client";

import { useState } from "react";
import { serviceCategories } from "@/data/services";
import { contactInfo } from "@/data/contact";
import { ServiceIcon } from "@/components/icons/ServiceIcons";

export default function SzolgaltatasokPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mit és mennyiért csinálunk?
          </h1>
          <div className="w-20 h-1 bg-rona-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Átlátható árak, magas színvonalú szakorvosi ellátás
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-rona-600 text-white hover:bg-rona-700 transition-all group"
              >
                <span className="flex items-center gap-3 text-lg font-semibold">
                  <ServiceIcon serviceId={category.id} size={28} className="flex-shrink-0" />
                  {category.name}
                </span>
                <svg
                  className={`w-6 h-6 transition-transform duration-300 ${
                    openCategory === category.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openCategory === category.id
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-100">
                      {category.services.map((service, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 pr-4">
                            <span className="text-gray-800">{service.name}</span>
                            {service.note && (
                              <span className="block text-sm text-gray-500 mt-0.5">
                                ({service.note})
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right whitespace-nowrap">
                            <span className="font-semibold text-rona-600">
                              {service.price}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-rona-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Kérdése van?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Hívjon minket, és kollégáink készséggel válaszolnak kérdéseire!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 bg-rona-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rona-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {contactInfo.phone}
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-2 border-2 border-rona-600 text-rona-600 px-6 py-3 rounded-lg font-semibold hover:bg-rona-600 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {contactInfo.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
