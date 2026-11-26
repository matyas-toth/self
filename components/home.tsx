import Image from "next/image";
import { dict, href, type Locale } from "@/lib/i18n";
import { Header } from "./header";
import { Page } from "./page";
import { Row } from "./row";

const LINKS = {
  github: "https://github.com/matyas-toth",
  x: "https://x.com/madebyreig",
  linkedin: "https://www.linkedin.com/in/m%C3%A1ty%C3%A1s-t%C3%B3th-56920926b/",
  email: "mailto:hello@maty.as",
};

function A({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <a href={to} target={to.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="link whitespace-nowrap">
      {children}
    </a>
  );
}

function Brand({ to, icon, children }: { to: string; icon: string; children: React.ReactNode }) {
  return (
    <a href={to} target="_blank" rel="noreferrer" className="group whitespace-nowrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" width={16} height={16} className="mr-1 inline-block size-4 rounded-[3px] align-[-2px] dark:ring-1 dark:ring-white/15" />
      <span className="link">{children}</span>
    </a>
  );
}

const DataGroup = (
  <Brand to="https://www.datagroup.de" icon="/icons/datagroup.png">
    DATAGROUP Enterprise Services
  </Brand>
);
const ShipperKit = (
  <Brand to="https://shipperkit.dev" icon="/icons/shipperkit.svg">
    ShipperKit
  </Brand>
);

const bio: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <p>
        I build agents and agentic systems. At {DataGroup}, I work as an Automation Specialist.
        I&apos;m developing {ShipperKit}, a platform for deploying apps, databases, and services on
        your own Linux server. I also build mobile apps and work on marketing.
      </p>
      <p>
        You can reach me on <A to={LINKS.github}>GitHub</A>, <A to={LINKS.x}>X</A>,{" "}
        <A to={LINKS.linkedin}>LinkedIn</A> and <A to={LINKS.email}>email</A>.
      </p>
    </>
  ),
  hu: (
    <>
      <p>
        Agenteket és rájuk épülő rendszereket készítek. A {DataGroup} csapatában Automation
        Specialistként dolgozom. Fejlesztem a {ShipperKit} platformot, amellyel alkalmazásokat,
        adatbázisokat és szolgáltatásokat telepíthetsz a saját Linux-szerveredre. Emellett
        mobilappokat készítek és marketinggel foglalkozom.
      </p>
      <p>
        Elérsz a <A to={LINKS.github}>GitHubon</A>, <A to={LINKS.x}>X-en</A>,{" "}
        <A to={LINKS.linkedin}>LinkedInen</A> vagy <A to={LINKS.email}>e-mailben</A>.
      </p>
    </>
  ),
};

export function Home({ locale }: { locale: Locale }) {
  const t = dict[locale];
  return (
    <Page>
      <Header locale={locale} alt={locale === "en" ? "/hu" : "/"} />

      <section className="mt-16 flex items-center gap-3.5">
        <Image
          src="/avatar.jpg"
          alt="Mátyás Tóth"
          width={46}
          height={46}
          priority
          className="size-[46px] rounded-full object-cover"
        />
        <div className="leading-snug">
          <div className="text-[17px] text-fg">Mátyás Tóth</div>
          <div className="text-[15px] text-muted">{t.role}</div>
        </div>
      </section>

      <section className="mt-12 space-y-8 text-[16px] leading-[1.875]">{bio[locale]}</section>

      <section className="mt-20">
        <h2 className="text-[15px] text-muted">{t.collections}</h2>
        <div className="mt-5">
          <Row href={href(locale, "/blog")} left={t.blog} right={t.blogTitle} />
        </div>
      </section>
    </Page>
  );
}
