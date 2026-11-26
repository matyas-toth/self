import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, formatDate, href, type Locale } from "@/lib/i18n";
import { getPost, getPosts } from "@/lib/posts";
import { Header } from "./header";
import { MDX } from "./mdx";
import { Page } from "./page";
import { Row } from "./row";

export async function BlogIndex({ locale }: { locale: Locale }) {
  const t = dict[locale];
  const posts = await getPosts();
  return (
    <Page>
      <Header locale={locale} alt={locale === "en" ? "/hu/blog" : "/blog"} />
      <section className="mt-16">
        <h1 className="text-[15px] text-muted">{t.blogTitle}</h1>
        <div className="mt-5 space-y-3">
          {posts.map((p) => (
            <Row
              key={p.slug}
              href={href(locale, `/blog/${p.slug}`)}
              left={p.title}
              right={formatDate(p.date, locale)}
            />
          ))}
        </div>
      </section>
    </Page>
  );
}

export async function BlogPost({ locale, slug }: { locale: Locale; slug: string }) {
  const t = dict[locale];
  const post = await getPost(slug);
  if (!post) notFound();
  return (
    <Page>
      <Header locale={locale} alt={locale === "en" ? `/hu/blog/${slug}` : `/blog/${slug}`} />
      <article className="mt-16">
        <Link
          href={href(locale, "/blog")}
          className="text-[15px] text-muted transition-colors hover:text-fg"
        >
          {t.blogTitle}
        </Link>
        <h1 className="mt-5 text-[17px] text-fg">{post.meta.title}</h1>
        <time dateTime={post.meta.date} className="text-[15px] text-muted">
          {formatDate(post.meta.date, locale)}
        </time>
        <div className="prose mt-10">
          <MDX source={post.content} />
        </div>
      </article>
    </Page>
  );
}

export async function postParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function postMetadata(slug: string) {
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: `/blog/${encodeURIComponent(post.meta.slug)}` },
  };
}
