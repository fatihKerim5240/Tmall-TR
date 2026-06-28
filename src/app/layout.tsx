import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tmall TR — Türkiye'nin Süper Alışveriş Merkezi",
  description: "Markalar, flash indirimler, güvenli alışveriş",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
