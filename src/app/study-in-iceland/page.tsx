import type { Metadata } from "next";
import Link from "next/link";
import { SUBJECTS } from "@/lib/seo/axes";

export const metadata: Metadata = {
  title: { absolute: "Study in Iceland — the Icelandic-language pathway by subject | AlmiIcelandic" },
  description:
    "Studying in Iceland often means meeting an Icelandic-language requirement. Explore the pathway by subject, with honest readiness practice — never a fabricated official result.",
  alternates: { canonical: "/study-in-iceland" },
};

export default function StudyHub() {
  return (
    <main className="bg-almi-bg text-almi-text">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-semibold text-almi-ink sm:text-4xl">Study in Iceland</h1>
        <p className="mt-3 max-w-2xl text-base text-almi-text">
          Whatever you plan to study in Iceland, the step students most often underestimate is the
          Icelandic-language requirement — Icelandic-taught programmes typically expect around B2, and the
          University of Iceland entrance exam is a common gateway. Choose a field to see the language pathway
          and practise honestly for the Icelandic exams — Ríkisborgarapróf and the CEFR levels.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {SUBJECTS.map((s) => (
            <li key={s.slug}>
              <Link href={`/study-in-iceland/${s.slug}`} className="block rounded-2xl border border-almi-bg-peach bg-almi-paper p-4 text-almi-ink hover:border-almi-coral">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
