// Practice hub — "Choose a Test". Three tracks: Citizenship (Ríkisborgarapróf,
// A2), University (University of Iceland entrance exam) and General Icelandic
// (CEFR A1–C1). Each card routes to /practice/<slug>. Reading + Listening are
// free to taste; Writing, Speaking and the timed mock are Pro. Every readout is a
// practice estimate — never an official Directorate of Education or Ministry of
// Justice result.

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  CITIZENSHIP_EXAMS,
  UNIVERSITY_EXAMS,
  CEFR_EXAMS,
  type ExamMeta,
} from "@/lib/is/registry";

function ExamCard({ exam }: { exam: ExamMeta }) {
  return (
    <Link
      href={`/practice/${exam.slug}`}
      className="flex flex-col rounded-2xl border border-almi-bg-peach bg-almi-paper p-5 shadow-sm transition hover:border-almi-coral"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold text-almi-ink">{exam.name}</h3>
        <span className="rounded-full bg-almi-teal/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-almi-teal">
          {exam.cefr}
        </span>
      </div>
      {exam.lead && (
        <span className="mt-2 inline-flex w-fit rounded-full bg-almi-coral/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-almi-coral-deep">
          Citizenship
        </span>
      )}
      <p className="mt-2 text-sm text-almi-text">{exam.blurb}</p>
      <p className="mt-3 text-sm font-semibold text-almi-coral">Practise →</p>
    </Link>
  );
}

export default async function PracticePage() {
  await requireUser();

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-almi-accent-deep">
          AlmiIcelandic · practice
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-almi-ink">Choose a test</h1>
        <p className="mt-2 max-w-2xl text-sm text-almi-text">
          Reading and Listening are auto-marked and free to practise. Writing and Speaking are graded
          with honest AI-style feedback against the level&apos;s criteria. Every readout is a practice
          estimate — never an official Directorate of Education or Ministry of Justice result.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-almi-ink">Citizenship — Ríkisborgarapróf (A2)</h2>
        <p className="mt-1 text-sm text-almi-text-muted">
          The Icelandic language test for citizenship: A2 across Reading, Listening, Writing and
          Speaking. Overseen by the Ministry of Justice and delivered by the Directorate of Education
          and School Services (Miðstöð menntunar og skólaþjónustu). Passing is the language
          requirement — confirm the current residency requirement with Útlendingastofnun.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CITIZENSHIP_EXAMS.map((exam) => (
            <ExamCard key={exam.slug} exam={exam} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-almi-ink">University of Iceland entrance</h2>
        <p className="mt-1 text-sm text-almi-text-muted">
          The Icelandic proficiency exam for admission to programmes taught in Icelandic at the
          University of Iceland (Háskóli Íslands) — a higher-level route across all four skills.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {UNIVERSITY_EXAMS.map((exam) => (
            <ExamCard key={exam.slug} exam={exam} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-almi-ink">General Icelandic (CEFR)</h2>
        <p className="mt-1 text-sm text-almi-text-muted">
          The full CEFR ladder from A1 to C1 for everyday Icelandic — self-study that also feeds the
          citizenship and university routes. Practise Reading, Listening, Writing and Speaking at your
          level.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CEFR_EXAMS.map((exam) => (
            <ExamCard key={exam.slug} exam={exam} />
          ))}
        </div>
      </section>

      <p className="text-xs text-almi-text-muted">
        Every task here is written from scratch by AlmiIcelandic. We never copy or reproduce official
        test material. Estimates are for practice only — confirm the exam you need with the official
        body.
      </p>
    </div>
  );
}
