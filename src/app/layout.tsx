import type { Metadata } from "next";
import { Inter, Allura } from "next/font/google";
import "./globals.css";
import { GlobalHeader } from "@/components/GlobalHeader";
import { GlobalFooter } from "@/components/GlobalFooter";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const allura = Allura({ variable: "--font-allura", subsets: ["latin"], weight: "400", display: "swap" });

const SITE_URL = "https://almiicelandic.almiworld.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AlmiIcelandic — Ríkisborgarapróf, University of Iceland & CEFR Icelandic practice with honest AI feedback",
    template: "%s · AlmiIcelandic",
  },
  description:
    "Practise Icelandic for Ríkisborgarapróf (the A2 citizenship language test), the University of Iceland entrance exam, and the CEFR levels A1–C1 with honest per-skill readiness estimates and AI feedback. $12/month with a 7-day free trial. Original material, never copied from official exam papers. Part of the AlmiWorld family.",
  applicationName: "AlmiIcelandic",
  authors: [{ name: "AlmiWorld" }],
  keywords: ["Ríkisborgarapróf", "Icelandic citizenship test", "learn Icelandic", "Icelandic exam practice", "University of Iceland Icelandic entrance", "CEFR Icelandic", "íslenskupróf", "AlmiIcelandic", "AlmiWorld"],
  openGraph: {
    title: "AlmiIcelandic — honest Ríkisborgarapróf & CEFR Icelandic practice",
    description: "Original Icelandic practice for Ríkisborgarapróf, the University of Iceland entrance exam and the CEFR levels — honest per-skill readiness estimates and AI feedback.",
    url: SITE_URL,
    siteName: "AlmiIcelandic",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "AlmiIcelandic — Ríkisborgarapróf & CEFR Icelandic practice", description: "Honest Icelandic practice — per-skill readiness estimates, ranges not inflated numbers." },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${allura.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <GlobalHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <GlobalFooter />
      </body>
    </html>
  );
}
