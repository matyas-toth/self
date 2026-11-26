import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog";
import { dict } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/metadata";

export const metadata: Metadata = {
  title: dict.en.blogTitle,
  description: "Random Thoughts, a blog by Mátyás Tóth.",
  alternates: localizedAlternates("en", "/blog"),
};

export default function Page() {
  return <BlogIndex locale="en" />;
}
