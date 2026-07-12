import type { Metadata } from "next";
import Link from "next/link";
import { CITIZENSHIP_EXAMS, UNIVERSITY_EXAMS, CEFR_EXAMS } from "@/lib/is/registry";
import { TestimonialsSection } from "@/components/reviews/TestimonialsSection";

// Re-render hourly so newly approved testimonials appear without a redeploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "AlmiIcelandic | Practise Icelandic Exams with Honest Readiness",
  },
  description:
    "Stop guessing your Icelandic level for citizenship or university. Practise the real Ríkisborgarapróf (A2) and University of Iceland entrance formats with honest AI readiness bands.",
  openGraph: {
    title: "AlmiIcelandic — honest Icelandic exam practice",
    description:
      "Original practice for Ríkisborgarapróf, the University of Iceland entrance exam, and the CEFR ladder — with a readiness estimate shown honestly, not an inflated score.",
  },
};

const PROMISES = [
  {
    title: "Three Icelandic tracks",
    detail:
      "Ríkisborgarapróf — the A2 Icelandic-language test for citizenship — plus the University of Iceland (Háskóli Íslands) entrance exam and the general CEFR ladder (A1–C1), all across Reading, Listening, Writing and Speaking.",
  },
  {
    title: "Honest readiness, not a fake score",
    detail:
      "Objective Reading and Listening are auto-marked to a clear readiness band. Writing and Speaking get AI feedback labelled an estimate. We never invent an official Directorate of Education or Ministry result.",
  },
  {
    title: "100% original material",
    detail:
      "Every reading text, audio transcript, writing task and speaking prompt is written from scratch to mirror the real task types — never copied from a real exam.",
  },
  {
    title: "Feedback you can act on",
    detail:
      "AI feedback on productive tasks points to what to fix next — against each exam's real criteria, level-aware, constructive and never inflated.",
  },
] as const;

const PRICING_LINES = [
  "Full access to Writing & Speaking AI-evaluation modules across all three tracks",
  "Free, unlimited auto-marked Reading and Listening practice",
  "AI analysis modelled on the real task formats and criteria — always an estimate, never an official Directorate of Education result",
  "Full timed mock for your chosen exam, with per-skill readiness and progress tracking",
  "Flat $12/month with one-click cancellation inside your account",
] as const;

const FAQ = [
  {
    q: "Which Icelandic exams does AlmiIcelandic cover?",
    a: "Three tracks. Ríkisborgarapróf: the Icelandic-language test for citizenship, at A2, across Reading, Listening, Writing and Speaking — overseen by the Ministry of Justice and delivered by the Directorate of Education and School Services (Miðstöð menntunar og skólaþjónustu). The University of Iceland (Háskóli Íslands) Icelandic entrance exam, for admission to Icelandic-taught programmes. And the general CEFR ladder, A1 to C1, for self-study. You pick your exam in your account, and your practice and full mock run for it.",
  },
  {
    q: "Is Ríkisborgarapróf what I need for Icelandic citizenship?",
    a: "Passing Ríkisborgarapróf (A2) is the language requirement for Icelandic citizenship. There are also residency and other conditions, and the rules change over time — so we don't state a fixed number of years or a fixed step. Always confirm the current requirement with Útlendingastofnun (the Directorate of Immigration) before you rely on it. We help you prepare fairly; we never claim to help anyone shortcut the process.",
  },
  {
    q: "Is my AlmiIcelandic estimate my real exam result?",
    a: "No. It's a practice readiness estimate to guide your prep — a per-skill band (Clear or Borderline) against the real criteria. Only the official assessments issue real results.",
  },
  {
    q: "How does the citizenship track work?",
    a: "You practise the four skills — Reading (Lestur), Listening (Hlustun), Writing (Ritun) and Speaking (Tal) — at A2, the Ríkisborgarapróf level. Reading and Listening are auto-marked; Writing and Speaking get honest AI feedback. It's preparation, not the official test, and it points you to what to work on next.",
  },
  {
    q: "Is the practice copied from a real exam?",
    a: "No. Every text, audio transcript, writing task and speaking prompt is original, written from scratch to mirror the real task types. We never copy or reproduce official Directorate of Education or Ministry material.",
  },
  {
    q: "How much does AlmiIcelandic cost?",
    a: "$12 per month with a 7-day free trial, monthly only, cancel anytime. Reading and Listening practice is free; AI feedback on Writing and Speaking and the full timed mock are part of the subscription.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// Illustrative sample — clearly labelled, never a real user, never a real result.
const SAMPLE = [
  { skill: "Lestur", band: "Clear", pct: 82 },
  { skill: "Hlustun", band: "Borderline", pct: 64 },
  { skill: "Ritun", band: "Estimate", pct: 71 },
  { skill: "Tal", band: "Estimate", pct: 58 },
];

function ReadinessMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-3xl border border-almi-bg-peach bg-almi-paper p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-almi-text-muted">Sample readiness · Ríkisborgarapróf (A2)</p>
          <span className="rounded-full bg-almi-bg-peach px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-almi-ink">Sample</span>
        </div>
        <ul className="mt-4 space-y-3">
          {SAMPLE.map((s) => (
            <li key={s.skill}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-almi-ink">{s.skill}</span>
                <span className="font-semibold text-almi-coral-deep">{s.band}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-almi-bg-peach">
                <div className="h-2 rounded-full bg-almi-coral" style={{ width: `${s.pct}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-xl border border-almi-bg-peach bg-almi-bg px-4 py-3">
          <p className="text-xs text-almi-text-muted">
            A readiness band per skill against the real criteria — never an invented official result.
          </p>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-almi-text-muted">Illustrative example — not a real result.</p>
    </div>
  );
}

const RIKIS = CITIZENSHIP_EXAMS[0];
const UNI = UNIVERSITY_EXAMS[0];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-almi-bg text-almi-text">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-almi-bg via-almi-bg to-almi-bg-peach px-6 pt-16 pb-20 sm:pt-20">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 z-0 h-96 w-96 rounded-full bg-almi-accent/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-16 z-0 h-80 w-80 rounded-full bg-almi-coral/10 blur-3xl" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-almi-accent-deep">AlmiIcelandic · Icelandic exam practice</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] text-almi-ink sm:text-5xl">
              Practise Icelandic with <span className="text-almi-coral">honest readiness.</span>
            </h1>
            <p className="mt-5 text-lg text-almi-text">
              Original practice for three tracks — Ríkisborgarapróf, the A2 Icelandic-language test for
              citizenship; the University of Iceland entrance exam; and the CEFR ladder (A1–C1) — with an
              honest readiness estimate against each exam's real criteria, so you know exactly what to work on next.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-almi-coral/30"
              >
                Start your 7-day free trial
              </Link>
              <Link href="/login" className="text-sm font-medium text-almi-coral hover:underline">
                Already have an account? Log in →
              </Link>
            </div>
            <p className="mt-4 text-sm text-almi-text-muted">
              $12/month, 7-day free trial, cancel anytime · Reading &amp; Listening free · Original material, never copied
            </p>
          </div>
          <ReadinessMockup />
        </div>
      </section>

      {/* Honest hook */}
      <section className="border-t border-almi-bg-peach bg-almi-paper px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-semibold text-almi-ink">An honest estimate, not a fake score</h2>
          <p className="mt-5 text-base text-almi-text">
            The real exams are set and marked by their official bodies — the Ministry of Justice and the
            Directorate of Education and School Services for Ríkisborgarapróf, and the University of Iceland for
            its entrance exam — so anyone promising you a precise official result from practice is guessing.
            AlmiIcelandic does the honest thing instead: we estimate your readiness from your practice and show
            it plainly — a per-skill band (Clear or Borderline) against each exam's real criteria.
          </p>
          <p className="mt-4 text-base text-almi-text">
            One principle runs through it: <strong className="text-almi-ink">tell you the truth.</strong> Honest,
            level-aware feedback, 100% original material, and a clear read on what to work on next — then
            confirm the requirement you need with the relevant authority.
          </p>
        </div>
      </section>

      {/* Citizenship lead */}
      <section className="border-t border-almi-bg-peach bg-almi-bg-peach/40 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-almi-coral/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-almi-coral-deep">
            Citizenship language route
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-almi-ink">Ríkisborgarapróf — the A2 test for citizenship. Start here.</h2>
          <p className="mt-4 text-base text-almi-text">
            Passing Ríkisborgarapróf, the Icelandic-language test at A2, is the language requirement for
            Icelandic citizenship — overseen by the Ministry of Justice and delivered by the Directorate of
            Education and School Services. Practise the four skills and get an honest read on whether you're
            ready. There are also residency and other conditions, and rules change, so always confirm the
            current requirement with Útlendingastofnun (the Directorate of Immigration). We help you prepare
            fairly — never to shortcut the process.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep"
            >
              Practise Ríkisborgarapróf — free trial
            </Link>
          </div>
        </div>
      </section>

      {/* Three tracks */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-almi-ink">Three Icelandic tracks</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-almi-text-muted">
            Reading and Listening are auto-marked and free to practise. Writing and Speaking are graded with
            honest AI feedback against each exam's real criteria.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Citizenship */}
            <div className="rounded-2xl border border-almi-coral/40 bg-almi-paper p-6 ring-1 ring-almi-coral/20">
              <p className="text-xs font-bold uppercase tracking-widest text-almi-coral">Citizenship · Lead</p>
              <h3 className="mt-2 text-xl font-semibold text-almi-ink">Ríkisborgarapróf</h3>
              <ul className="mt-4 space-y-2 text-sm text-almi-text">
                <li className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-6 min-w-[2.5rem] items-center justify-center rounded-md bg-almi-bg-peach px-1.5 text-xs font-bold text-almi-ink">{RIKIS.cefr}</span>
                  <span className="font-semibold text-almi-ink">{RIKIS.name}</span>
                </li>
                <li className="text-almi-text-muted">{RIKIS.blurb}</li>
                <li className="text-almi-text-muted">The language requirement for Icelandic citizenship — confirm residency rules with Útlendingastofnun.</li>
              </ul>
            </div>

            {/* University */}
            <div className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-almi-teal">University of Iceland</p>
              <h3 className="mt-2 text-xl font-semibold text-almi-ink">Entrance exam</h3>
              <ul className="mt-4 space-y-2 text-sm text-almi-text">
                <li className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-6 items-center justify-center rounded-md bg-almi-bg-peach px-2 text-xs font-bold text-almi-ink">Advanced</span>
                  <span className="font-semibold text-almi-ink">Háskóli Íslands</span>
                </li>
                <li className="text-almi-text-muted">{UNI.blurb}</li>
                <li className="text-almi-text-muted">For admission to Icelandic-taught programmes — confirm the exact required level with the University of Iceland.</li>
              </ul>
            </div>

            {/* CEFR ladder */}
            <div className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-almi-accent-deep">CEFR ladder</p>
              <h3 className="mt-2 text-xl font-semibold text-almi-ink">Icelandic A1–C1</h3>
              <ul className="mt-4 space-y-2 text-sm text-almi-text">
                {CEFR_EXAMS.map((e) => (
                  <li key={e.exam} className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-6 min-w-[2.5rem] items-center justify-center rounded-md bg-almi-bg-peach px-1.5 text-xs font-bold text-almi-ink">{e.cefr}</span>
                    <span className="font-semibold text-almi-ink">{e.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why honest */}
      <section className="border-t border-almi-bg-peach px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-semibold text-almi-ink">Honest readiness, exam by exam</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {PROMISES.map((p) => (
              <li key={p.title} className="flex items-start gap-3 rounded-2xl border border-almi-bg-peach bg-almi-paper p-5">
                <span aria-hidden className="mt-0.5 flex-shrink-0 select-none font-bold text-almi-teal">✓</span>
                <p className="text-sm text-almi-text">
                  <span className="font-semibold text-almi-ink">{p.title}</span>
                  {" — "}
                  {p.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-almi-bg-peach bg-almi-paper px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-almi-ink">Simple, honest pricing</h2>
          <p className="mt-3 text-xl font-semibold text-almi-ink">$12/month — 7-day free trial, cancel anytime.</p>
          <ul className="mx-auto mt-6 max-w-xl space-y-2 text-left text-sm text-almi-text">
            {PRICING_LINES.map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span aria-hidden className="mt-0.5 flex-shrink-0 select-none font-bold text-almi-teal">✓</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-6 max-w-xl text-sm text-almi-text-muted">
            25% of AlmiIcelandic proceeds fund the Shamool Foundation&apos;s social mission — free primary-school education and daily hot meals for underprivileged children in Lahore, Pakistan.
          </p>
          <div className="mt-8">
            <Link href="/signup" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep">
              Start your 7-day free trial
            </Link>
          </div>
          <p className="mt-4 text-sm text-almi-text-muted">
            <Link href="/pricing" className="underline hover:text-almi-ink">See full pricing</Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-semibold text-almi-ink">Common questions</h2>
          <dl className="mt-10 space-y-6">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-2xl border border-almi-bg-peach bg-almi-bg p-6">
                <dt className="text-lg font-semibold text-almi-ink">{f.q}</dt>
                <dd className="mt-2 text-sm text-almi-text">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <TestimonialsSection />

      {/* Final CTA */}
      <section className="border-t border-almi-bg-peach bg-almi-paper px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-almi-ink">Practise honestly. Walk in ready.</h2>
          <p className="mt-3 text-base text-almi-text">
            All three Icelandic tracks at your level, honest readiness estimates, 100% original material — for
            $12/month with a 7-day free trial.
          </p>
          <div className="mt-8">
            <Link href="/signup" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep">
              Start your 7-day free trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
