import type { Metadata } from "next";
import { Home } from "@/components/home";

export const metadata: Metadata = {
  description: "Agenteket és rájuk épülő rendszereket készítek. Automation Specialist a DATAGROUP-nál. ShipperKit, mobilappok, marketing és növekedés.",
};

export default function Page() {
  return <Home locale="hu" />;
}
