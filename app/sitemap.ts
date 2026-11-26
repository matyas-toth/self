import type { MetadataRoute } from "next";
import { href } from "@/lib/i18n";
import { siteUrl } from "@/lib/metadata";
import { getPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["/", "/blog"].flatMap((path) => [path, href("hu", path)]);
  const posts = (await getPosts()).map(({ slug }) => `/blog/${encodeURIComponent(slug)}`);

  return [...pages, ...posts].map((path) => ({ url: new URL(path, siteUrl).href }));
}
