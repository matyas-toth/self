import type { Metadata } from "next";
import { BlogPost, postMetadata, postParams } from "@/components/blog";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = postParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return postMetadata((await params).slug);
}

export default async function Page({ params }: Props) {
  return <BlogPost locale="en" slug={(await params).slug} />;
}
