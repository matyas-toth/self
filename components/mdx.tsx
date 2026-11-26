import { evaluate } from "@mdx-js/mdx";
import Link from "next/link";
import * as runtime from "react/jsx-runtime";

const components = {
  a: ({ href = "", ...props }: React.ComponentProps<"a">) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noreferrer" {...props} />
    ),
};

export async function MDX({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, {
    ...(runtime as Parameters<typeof evaluate>[1]),
  });
  return <Content components={components} />;
}
