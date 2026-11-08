import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bunga Untuk Dia - Mini RPG Story Game",
  description: "Mini game pixel art: Kumpulkan bunga dan buat buket terindah untuk dia di bawah langit senja.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 select-none">
        {children}
      </body>
    </html>
  );
}
