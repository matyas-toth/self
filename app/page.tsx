import type { Metadata } from "next";
import { Home } from "@/components/home";
import { localizedAlternates } from "@/lib/metadata";

export const metadata: Metadata = {
  alternates: localizedAlternates("en", "/"),
};

export default function Page() {
  return <Home locale="en" />;
}
