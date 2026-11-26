import type { Metadata } from "next";
import { Home } from "@/components/home";
import { localizedAlternates } from "@/lib/metadata";

export const metadata: Metadata = {
  description: "Agenteket és rájuk épülő rendszereket készítek. Automation Specialist a DATAGROUP-nál. ShipperKit, mobilappok, marketing és növekedés.",
  alternates: localizedAlternates("hu", "/"),
};

export default function Page() {
  return <Home locale="hu" />;
}
