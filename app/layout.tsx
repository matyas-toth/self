import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AsciiSky } from "@/components/ascii-sky";
import { siteUrl } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "Mátyás Tóth", template: "%s · Mátyás Tóth" },
  description: "I build agents and agentic systems. Automation Specialist at DATAGROUP. ShipperKit, mobile apps, and experiments in marketing and growth.",
  openGraph: {
    type: "website",
    siteName: "Mátyás Tóth",
    url: "./",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Mátyás Tóth", type: "image/png" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0d" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light'}catch(_){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="relative isolate min-h-screen font-sans">
        <AsciiSky />
        {children}
      </body>
    </html>
  );
}
