import Link from "next/link";

export function Row({ href, left, right }: { href: string; left: string; right: string }) {
  return (
    <Link href={href} className="group flex items-baseline text-[16px]">
      <span className="text-fg">{left}</span>
      <span className="leader" />
      <span className="text-muted transition-colors group-hover:text-fg">{right}</span>
    </Link>
  );
}
