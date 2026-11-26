import Link from "next/link";
import { dict, href, type Locale } from "@/lib/i18n";
import { ThemeToggle } from "./theme-toggle";

export function Header({ locale, alt }: { locale: Locale; alt: string }) {
  const t = dict[locale];
  return (
    <header className="flex items-center justify-between">
      <Link href={href(locale, "/")} className="text-[22px] tracking-tight text-fg">
        MT
      </Link>
      <nav className="flex items-center gap-5 text-[15px]">
        <Link href={alt} className="text-muted transition-colors hover:text-fg">
          {t.other}
        </Link>
        <ThemeToggle labels={t.theme} />
      </nav>
    </header>
  );
}
