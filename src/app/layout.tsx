import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RónaRendelő - Szakorvosi Magánrendelő Budapest",
    template: "%s | RónaRendelő"
  },
  description: "Szakorvosi magánrendelő Budapest XIV. kerületében. Bőrgyógyászat, ortopédia, urológia, sebészet, ultrahang diagnosztika. Elismert szakorvosok, nyugodt környezet.",
  keywords: ["magánrendelő", "Budapest", "szakorvos", "bőrgyógyász", "ortopédia", "urológia", "sebészet", "ultrahang", "XIV. kerület", "Zugló"],
  authors: [{ name: "RónaRendelő" }],
  openGraph: {
    title: "RónaRendelő - Szakorvosi Magánrendelő Budapest",
    description: "Szakorvosi magánrendelő Budapest XIV. kerületében. Elismert szakorvosok, nyugodt környezet, kiszámítható időpontok.",
    url: "https://www.ronarendelo.hu",
    siteName: "RónaRendelő",
    locale: "hu_HU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://www.ronarendelo.hu"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
