import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description?: string;
};

function toISODate(value: unknown) {
  const d = value instanceof Date ? value : new Date(String(value));
  return d.toISOString().slice(0, 10);
}

async function readPost(file: string) {
  const raw = await fs.readFile(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const meta: PostMeta = {
    slug: file.replace(/\.mdx?$/, ""),
    title: String(data.title ?? file),
    date: toISODate(data.date ?? new Date()),
    description: data.description ? String(data.description) : undefined,
  };
  return { meta, content, draft: Boolean(data.draft) };
}

export async function getPosts(): Promise<PostMeta[]> {
  const files = (await fs.readdir(DIR)).filter((f) => /\.mdx?$/.test(f));
  const posts = await Promise.all(files.map(readPost));
  return posts
    .filter((p) => !p.draft)
    .map((p) => p.meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  const files = await fs.readdir(DIR);
  const file = files.find((f) => f === `${slug}.mdx` || f === `${slug}.md`);
  if (!file) return null;
  const post = await readPost(file);
  return post.draft ? null : post;
}
