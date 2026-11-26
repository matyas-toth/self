import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.en.blogTitle };

export default function Page() {
  return <BlogIndex locale="en" />;
}
