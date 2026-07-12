import type { Metadata } from "next";
import Link from "next/link";

// Honest requirements explainer: what Icelandic you need for citizenship —
// Ríkisborgarapróf at A2 — and how to PREPARE for it. Framed as honest
// preparation, never as beating or getting around Útlendingastofnun. ISR.
export const revalidate = 2592000;

const SITE = "https://almiicelandic.almiworld.com";
const PATH = "/requirements/iceland/rikisborgaraprof-citizenship";

export const metadata: Metadata = {
  title: { absolute: "What Icelandic do you need for citizenship? Ríkisborgarapróf at A2 | AlmiIcelandic" },
  description:
    "The Icelandic-language requirement for citizenship is Ríkisborgarapróf at CEFR A2, across Reading, Listening, Writing and Speaking. An honest explainer, and how to practise the four skills fairly. Residency and other conditions are decided by Útlendingastofnun — confirm your own situation with them.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "What Icelandic do you need for citizenship? Ríkisborgarapróf at A2",
    description:
      "Honest guide to the Icelandic citizenship language requirement (Ríkisborgarapróf, A2) and how to prepare. Confirm residency and other conditions with Útlendingastofnun.",
  },
};

const FAQ = [
  {
    q: "What Icelandic level do I need for citizenship?",
    a: "The language requirement for Icelandic citizenship is Ríkisborgarapróf, an Icelandic-language test set at CEFR A2 across Reading, Listening, Writing and Speaking. The exam is overseen by the Ministry of Justice and delivered by the Directorate of Education and School Services (Miðstöð menntunar og skólaþjónustu). Passing it demonstrates the language proof — the rest of the application is decided separately.",
  },
  {
    q: "Is passing Ríkisborgarapróf enough for citizenship?",
    a: "No — it is the language requirement, not the whole application. Citizenship also depends on residency and other conditions, and those are decided by Útlendingastofnun (the Directorate of Immigration). We don't state a fixed number of years or a fixed step, because the conditions change. Always confirm the current requirement for your own situation with Útlendingastofnun.",
  },
  {
    q: "Which skills does Ríkisborgarapróf test?",
    a: "All four language skills at A2: Reading (Lestur), Listening (Hlustun), Writing (Ritun) and Speaking (Tal). Preparing means getting comfortable with everyday Icelandic across each of them, rather than focusing on only one.",
  },
  {
    q: "How does AlmiIcelandic help?",
    a: "AlmiIcelandic is honest practice, not the official exam. You practise the four language skills (Reading, Listening, Writing, Speaking) at A2 and get a per-skill readiness band (Clear or Borderline) against the real task criteria — an estimate to guide your prep, never an official Directorate of Education or Ministry of Justice result.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

function Row({ skill, ice, note }: { skill: string; ice: string; note: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-2xl border border-almi-bg-peach bg-almi-paper p-5 sm:grid-cols-[8rem_6rem_1fr]">
      <div className="text-sm font-semibold text-almi-ink">{skill}</div>
      <div className="text-sm font-bold text-almi-coral-deep">{ice}</div>
      <div className="text-sm text-almi-text sm:col-span-1 col-span-2">{note}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="bg-almi-bg text-almi-text">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-3xl px-6 py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-almi-text-muted">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/" className="hover:text-almi-coral">Home</Link></li>
            <li className="flex items-center gap-1"><span aria-hidden>/</span><Link href="/exams" className="hover:text-almi-coral">Icelandic exams</Link></li>
            <li className="flex items-center gap-1"><span aria-hidden>/</span><span>Ríkisborgarapróf: citizenship Icelandic</span></li>
          </ol>
        </nav>

        <header>
          <p className="text-sm font-bold uppercase tracking-widest text-almi-accent-deep">Requirements · Iceland</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-almi-ink sm:text-4xl">
            What Icelandic do you need for citizenship? Ríkisborgarapróf at A2.
          </h1>
          <p className="mt-3 text-base text-almi-text">
            The Icelandic-language requirement for citizenship is <strong>Ríkisborgarapróf</strong>, a test set at CEFR{" "}
            <strong>A2</strong> across Reading, Listening, Writing and Speaking. It is overseen by the Ministry of Justice
            and delivered by the Directorate of Education and School Services (<em>Miðstöð menntunar og skólaþjónustu</em>).
            Here&apos;s an honest read on what it covers, and how to prepare for it fairly.
          </p>
        </header>

        <section className="mt-8 space-y-3">
          <Row skill="Reading" ice="Lestur" note="Understand short, everyday Icelandic texts — signs, notices, simple messages and forms." />
          <Row skill="Listening" ice="Hlustun" note="Follow clear, everyday spoken Icelandic on familiar topics at a natural but unhurried pace." />
          <Row skill="Writing" ice="Ritun" note="Write short, practical texts — a note, a form, a simple message — with basic A2 accuracy." />
          <Row skill="Speaking" ice="Tal" note="Handle simple, direct exchanges about everyday matters and answer familiar questions." />
          <p className="text-xs text-almi-text-muted">
            All four skills are assessed at A2. This is general information about the language requirement, not advice
            about your citizenship application.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-almi-ink">The language requirement is only one part</h2>
          <p className="mt-3 text-base text-almi-text">
            Passing Ríkisborgarapróf proves the <strong>language</strong> requirement for citizenship. It does not decide
            your application on its own — citizenship also depends on <strong>residency and other conditions</strong>, and
            those are set by <strong>Útlendingastofnun</strong> (the Directorate of Immigration). Those rules change over
            time, so we don&apos;t state a fixed number of years or a fixed step. The reliable move is to check your own
            situation directly with Útlendingastofnun rather than assuming.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-almi-ink">How to prepare — honestly</h2>
          <p className="mt-3 text-base text-almi-text">
            Preparation has the same shape whichever your circumstances: get comfortable with the four language skills —
            Reading (Lestur), Listening (Hlustun), Writing (Ritun) and Speaking (Tal) — at A2. AlmiIcelandic lets you
            practise all of them and shows an honest per-skill readiness band (Clear or Borderline) against the real task
            criteria — an estimate to guide your prep, never an official Directorate of Education or Ministry of Justice
            result. We help you prepare fairly; we don&apos;t claim to shortcut the process.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-almi-bg-peach bg-almi-paper p-6 text-center shadow-sm">
          <p className="text-base font-semibold text-almi-ink">Practise the four skills at A2 — honestly.</p>
          <Link
            href="/signup"
            className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep"
          >
            Start your 7-day free trial
          </Link>
          <p className="mt-3 text-xs text-almi-text-muted">$12/month after the trial · cancel anytime</p>
        </section>

        <section className="mt-10 rounded-2xl border border-almi-accent/40 bg-almi-accent/10 p-5">
          <p className="text-sm text-almi-ink">
            <strong>Always confirm your own requirement with Útlendingastofnun.</strong> Residency and citizenship rules
            change, and only the official authorities can tell you which conditions apply to your situation. AlmiIcelandic
            helps you prepare for the language test — it doesn&apos;t decide or replace the official process.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-almi-ink">Questions</h2>
          <dl className="mt-4 space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-5">
                <dt className="font-semibold text-almi-ink">{f.q}</dt>
                <dd className="mt-1 text-sm text-almi-text">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-almi-ink">Related</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            <li><Link href="/exams/rikisborgaraprof" className="inline-block rounded-full border border-almi-bg-peach bg-almi-paper px-3 py-1.5 text-sm text-almi-ink hover:border-almi-coral">Ríkisborgarapróf (A2) guide</Link></li>
            <li><Link href="/exams/cefr-a2" className="inline-block rounded-full border border-almi-bg-peach bg-almi-paper px-3 py-1.5 text-sm text-almi-ink hover:border-almi-coral">CEFR A2 Icelandic guide</Link></li>
            <li><Link href="/exams" className="inline-block rounded-full border border-almi-bg-peach bg-almi-paper px-3 py-1.5 text-sm text-almi-ink hover:border-almi-coral">All Icelandic exams</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
