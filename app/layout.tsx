import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AsciiSky } from "@/components/ascii-sky";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://maty.as"),
  title: { default: "Mátyás Tóth", template: "%s · Mátyás Tóth" },
  description: "I build agents and agentic systems. Automation Specialist at DATAGROUP. I develop ShipperKit and mobile apps, and work on marketing.",
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
