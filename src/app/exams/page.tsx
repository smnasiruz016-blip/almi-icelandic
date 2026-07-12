import type { Metadata } from "next";
import Link from "next/link";
import {
  CITIZENSHIP_EXAMS,
  UNIVERSITY_EXAMS,
  CEFR_EXAMS,
  type ExamMeta,
} from "@/lib/is/registry";

export const metadata: Metadata = {
  title: {
    absolute:
      "Icelandic exams — Ríkisborgarapróf, University of Iceland entrance & CEFR practice | AlmiIcelandic",
  },
  description:
    "The Icelandic language exams for citizenship, university and general proficiency — Ríkisborgarapróf (A2), the University of Iceland entrance exam, and the CEFR ladder A1–C1. Honest per-skill readiness practice across all four skills.",
  alternates: { canonical: "/exams" },
};

function ExamList({ exams }: { exams: ExamMeta[] }) {
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
      {exams.map((e) => (
        <li key={e.slug}>
          <Link
            href={`/exams/${e.slug}`}
            className="flex h-full flex-col rounded-2xl border border-almi-bg-peach bg-almi-paper p-5 hover:border-almi-coral"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 min-w-[2.5rem] items-center justify-center rounded-md bg-almi-bg-peach px-1.5 text-xs font-bold text-almi-ink">{e.cefr}</span>
              <span className="text-lg font-semibold text-almi-ink">{e.name}</span>
              {e.lead && <span className="rounded-full bg-almi-coral/15 px-2 py-0.5 text-xs font-semibold text-almi-coral-deep">Citizenship</span>}
            </div>
            <span className="mt-2 text-sm text-almi-text-muted">{e.blurb}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function IcelandicExamsHub() {
  return (
    <main className="bg-almi-bg text-almi-text">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-semibold text-almi-ink sm:text-4xl">
          Icelandic exams — citizenship, university &amp; CEFR
        </h1>
        <p className="mt-3 max-w-2xl text-base text-almi-text">
          The three routes to Icelandic for citizenship, study and everyday proficiency: the
          Ríkisborgarapróf (overseen by the Ministry of Justice, delivered by the Directorate of
          Education and School Services), the University of Iceland entrance exam, and the general
          CEFR ladder. Each tests Reading, Listening, Writing and Speaking. Pick a level for an honest
          readiness estimate — never a fabricated official result.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-almi-ink">Citizenship — Ríkisborgarapróf</h2>
          <p className="mt-1 text-sm text-almi-text-muted">
            The Icelandic language test for citizenship at A2 across all four skills. Passing is the
            language requirement — confirm the current residency requirement with Útlendingastofnun.
          </p>
          <ExamList exams={CITIZENSHIP_EXAMS} />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-almi-ink">University of Iceland entrance</h2>
          <p className="mt-1 text-sm text-almi-text-muted">
            Icelandic proficiency for admission to programmes taught in Icelandic at the University of
            Iceland (Háskóli Íslands) — a higher-level route across Reading, Listening, Writing and
            Speaking.
          </p>
          <ExamList exams={UNIVERSITY_EXAMS} />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-almi-ink">General Icelandic (CEFR)</h2>
          <p className="mt-1 text-sm text-almi-text-muted">
            The full CEFR ladder from A1 to C1 for everyday Icelandic — self-study that also feeds the
            citizenship and university routes.
          </p>
          <ExamList exams={CEFR_EXAMS} />
        </section>
      </div>
    </main>
  );
}
