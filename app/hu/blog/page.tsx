import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog";
import { dict } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/metadata";

export const metadata: Metadata = {
  title: dict.hu.blogTitle,
  description: "Kósza gondolatok, Mátyás Tóth blogja.",
  alternates: localizedAlternates("hu", "/blog"),
};

export default function Page() {
  return <BlogIndex locale="hu" />;
}
