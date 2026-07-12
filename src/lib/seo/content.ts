// Deterministic, honest, varied content generator for the pSEO matrix.
// Every page is composed from its axes' REAL attributes; phrasing variants are
// selected by hash(slug) so text distributes across millions of pages without
// thin duplication. Honesty guardrails (spec §7): readiness = band/estimate,
// never an official Directorate of Education / Ministry result; citizenship
// NEVER a fixed year count — always "confirm with Útlendingastofnun".

import { CITIZENSHIP_EXAMS, UNIVERSITY_EXAMS, CEFR_EXAMS, ALL_EXAMS, type ExamMeta } from "@/lib/is/registry";
import {
  hash, pick, studyPath, jobsPath,
  UNIVERSITIES, COUNTRIES, HUBS,
  type SeoUniversity, type SeoRole, type SeoCountry, type SeoSubject, type SeoHub,
} from "@/lib/seo/axes";

const SITE = "https://almiicelandic.almiworld.com";

export interface SeoPage {
  h1: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  intro: string[];
  sections: { heading: string; body: string[] }[];
  faq: { q: string; a: string }[];
  related: { href: string; label: string }[];
  breadcrumbs: { name: string; path: string }[];
  jsonLd: Record<string, unknown>;
}

// Honest per-subject descriptors + whether the field is typically regulated.
const SUBJECT_META: Record<string, { field: string; regulated: boolean }> = {
  "medicine-health-sciences": { field: "medicine, nursing and the health sciences", regulated: true },
  "engineering-technology": { field: "engineering and applied technology", regulated: false },
  "computer-science-it": { field: "computer science, software and IT", regulated: false },
  "business-management": { field: "business, management and economics", regulated: false },
  "law": { field: "law and legal studies", regulated: true },
  "natural-sciences": { field: "the natural sciences", regulated: false },
  "arts-humanities": { field: "the arts and humanities", regulated: false },
  "social-sciences": { field: "the social sciences", regulated: false },
  "education": { field: "education and teaching", regulated: true },
  "mathematics-statistics": { field: "mathematics and statistics", regulated: false },
  "architecture-design": { field: "architecture and design", regulated: true },
  "agriculture-environment": { field: "agriculture and environmental science", regulated: false },
};

// The three exam anchors the funnel links to. Ríkisborgarapróf (A2) is the
// citizenship language test; the University of Iceland entrance exam (B2) is the
// study-language route; the CEFR ladder feeds both.
const RIKIS = CITIZENSHIP_EXAMS[0];                                   // Ríkisborgarapróf (A2)
const UNI_ENTRANCE = UNIVERSITY_EXAMS[0];                             // University of Iceland entrance (B2)
const CEFR_B1 = CEFR_EXAMS.find((e) => e.exam === "CEFR_B1")!;        // Icelandic B1
const CEFR_B2 = CEFR_EXAMS.find((e) => e.exam === "CEFR_B2")!;        // Icelandic B2

// Shared honest fragments -----------------------------------------------------
const READINESS_LINE =
  "AlmiIcelandic gives you an honest readiness estimate — a per-skill band (Clear or Borderline) against each exam's real criteria — never an invented official Directorate of Education or Ministry result.";
const CITIZENSHIP_HEDGE =
  "Passing Ríkisborgarapróf, the Icelandic-language test at A2, is the language requirement for Icelandic citizenship — it is overseen by the Ministry of Justice and delivered by the Directorate of Education and School Services (Miðstöð menntunar og skólaþjónustu). There are also residency and other conditions for naturalisation, and the rules change, so we don't state a fixed number of years or a fixed step — always confirm the current requirement with Útlendingastofnun (the Directorate of Immigration). We help you prepare fairly; we never claim to help anyone shortcut or beat the process.";
const MISSION_LINE =
  "25% of AlmiIcelandic proceeds fund the Shamool Foundation's social mission.";
const CTA_LINE =
  "Reading and Listening practice is free; AI feedback on Writing and Speaking and the full timed mock unlock with a 7-day free trial ($12/month after, cancel anytime).";

function levelForSubject(subjectSlug: string): ExamMeta {
  // Icelandic-taught higher education sits around the University of Iceland
  // entrance level (B2); broader study/daily life is well served by B1.
  return SUBJECT_META[subjectSlug]?.regulated ? UNI_ENTRANCE : CEFR_B1;
}

// Display label for an exam. Append the CEFR only when the name doesn't already
// carry the level (e.g. "Icelandic A1" already ends in its level), to avoid
// "Icelandic A1 (A1)".
function examLabel(e: ExamMeta): string {
  return e.name.includes(e.cefr) ? e.name : `${e.name} (${e.cefr})`;
}

// A few sibling internal links (same subject, other origin countries).
function relatedStudy(subject: SeoSubject, country: SeoCountry, seed: number): { href: string; label: string }[] {
  const others = COUNTRIES.filter((c) => c.slug !== country.slug);
  const picks = [others[seed % others.length], others[(seed * 7 + 3) % others.length], others[(seed * 13 + 5) % others.length]]
    .filter((c, i, a) => c && a.findIndex((x) => x.slug === c.slug) === i);
  const uniPick = UNIVERSITIES[(seed * 17) % UNIVERSITIES.length];
  return picks.map((c) => ({ href: studyPath(subject.slug, c.slug, uniPick.slug), label: `${subject.name} in Iceland from ${c.name}` }));
}

// ---- STUDY PAGE -------------------------------------------------------------
export function buildStudyPage(subject: SeoSubject, country: SeoCountry, uni: SeoUniversity): SeoPage {
  const path = studyPath(subject.slug, country.slug, uni.slug);
  const seed = hash(path);
  const sm = SUBJECT_META[subject.slug] ?? { field: subject.name.toLowerCase(), regulated: false };
  const level = levelForSubject(subject.slug);
  const uniPlace = [uni.city, uni.countryName].filter(Boolean).join(", ");

  const introVariants = [
    `Planning to study ${sm.field} in Iceland from ${country.name}? The University of Iceland (Háskóli Íslands), the University of Akureyri and Reykjavík University offer strong programmes across ${subject.name.toLowerCase()}. Some master's courses are taught in English — but for an Icelandic-taught programme, and for daily life, the step students most often underestimate is Icelandic itself.`,
    `${subject.name} is a popular reason students from ${country.name} look to Iceland. Whichever university and town you aim for, one thing shapes how smoothly you settle in and follow an Icelandic-taught programme: your Icelandic.`,
    `If you're coming from ${country.name} to study ${sm.field} in Iceland, the academic side is only half the picture — where a programme is taught in Icelandic, the language pathway is what turns an offer into a place you can fully live and learn in.`,
  ];
  const uniLine =
    `${uni.name} — based in ${uniPlace} — is one of the institutions in our directory${uni.subjects.length ? `, associated with fields such as ${uni.subjects.slice(0, 3).join(", ")}` : ""}. If you studied at ${uni.name} or a comparable institution, your degree background matters for admission, but Icelandic proficiency is assessed separately.`;

  return {
    h1: `Study ${subject.name} in Iceland from ${country.name}`,
    subtitle: `Reference institution: ${uni.name} (${uniPlace})`,
    metaTitle: `Study ${subject.name} in Iceland from ${country.name} — Icelandic language pathway | AlmiIcelandic`,
    metaDescription: `The Icelandic-language route for ${country.name} students studying ${sm.field} in Iceland — typical level (${examLabel(level)}), honest readiness practice, and how to prepare. Not an official result.`,
    canonicalPath: path,
    intro: [pick(introVariants, seed), uniLine],
    sections: [
      {
        heading: "The Icelandic-language requirement",
        body: [
          `Iceland offers a number of English-taught programmes, especially at master's level — those may not require Icelandic for admission. Icelandic-taught programmes typically ask for roughly B1–B2, which maps to ${CEFR_B1.name} or ${CEFR_B2.name}, and the University of Iceland runs its own Icelandic entrance assessment for such programmes. Either way you'll need Icelandic for paperwork, part-time work and everyday life. Confirm the exact requirement with the specific university and programme.`,
          sm.regulated
            ? `${subject.name} is often a regulated field: beyond admission, professional practice in Iceland can require a set Icelandic level plus separate recognition of your qualifications (for example registration with Embætti landlæknis, the Director of Health, for healthcare roles). Treat the exam as one step and confirm recognition with the relevant Icelandic authority.`
            : `For ${sm.field}, a solid B1–B2 lets you follow an Icelandic-taught programme, write assignments and integrate — aim a level above the minimum if you can.`,
        ],
      },
      {
        heading: `Practise for ${examLabel(level)} — honestly`,
        body: [
          `AlmiIcelandic lets you practise the four skills — Reading (Lestur), Listening (Hlustun), Writing (Ritun) and Speaking (Tal) — at ${level.name} and the surrounding levels. ${READINESS_LINE}`,
          CTA_LINE,
        ],
      },
      {
        heading: "Thinking about staying after your studies?",
        body: [`If you plan to remain in Iceland after graduating, the language also matters for residency and, later, citizenship. ${CITIZENSHIP_HEDGE}`],
      },
    ],
    faq: [
      { q: `Do I need Icelandic to study ${subject.name} in Iceland?`, a: `For Icelandic-taught programmes, usually around B1–B2. Many English-taught master's waive it for admission, but you'll still need Icelandic day-to-day. Confirm with the university.` },
      { q: `Which level should I aim for?`, a: `Most Icelandic-taught higher education sits around ${CEFR_B1.name} to ${CEFR_B2.name}, and the University of Iceland has its own entrance assessment. Regulated fields and professional practice may need more. AlmiIcelandic shows an honest per-skill readiness band, not an official score.` },
      { q: `Is the readiness estimate my real result?`, a: `No. It's a practice estimate against the real criteria to guide your prep. Only the official assessment issues a real result.` },
    ],
    related: [
      { href: `/exams/${level.slug}`, label: `${examLabel(level)} exam guide` },
      { href: `/exams/${UNI_ENTRANCE.slug}`, label: `University of Iceland entrance exam` },
      { href: `/exams/${RIKIS.slug}`, label: `Ríkisborgarapróf (A2) — citizenship language test` },
      ...relatedStudy(subject, country, seed),
    ],
    breadcrumbs: [
      { name: "Study in Iceland", path: "/study-in-iceland" },
      { name: subject.name, path: `/study-in-iceland/${subject.slug}` },
      { name: country.name, path: path },
    ],
    jsonLd: faqJsonLd([
      { q: `Do I need Icelandic to study ${subject.name} in Iceland?`, a: `For Icelandic-taught programmes, usually around B1–B2; many English-taught master's waive it for admission. Confirm with the university.` },
    ], `${SITE}${path}`, `Study ${subject.name} in Iceland from ${country.name}`),
  };
}

// ---- JOBS PAGE --------------------------------------------------------------
export function buildJobsPage(role: SeoRole, country: SeoCountry, hub: SeoHub): SeoPage {
  const path = jobsPath(role.slug, country.slug, hub.slug);
  const seed = hash(path);
  const clientFacing = role.collar === "pink" || role.collar === "white";

  const introVariants = [
    `Moving from ${country.name} to work as a ${role.name} in ${hub.name}, Iceland? ${hub.profile} How much Icelandic you need depends a lot on the role — and it's easy to underestimate.`,
    `${role.name}s from ${country.name} looking at ${hub.name} face two questions: is there demand, and how good does my Icelandic need to be? ${hub.profile}`,
    `Working in Iceland as a ${role.name} — coming from ${country.name} — often starts with the language. ${hub.name}: ${hub.profile}`,
  ];

  return {
    h1: `Work in Iceland as a ${role.name} from ${country.name}`,
    subtitle: `${hub.name} · ${hub.region}`,
    metaTitle: `Work in Iceland as a ${role.name} from ${country.name} (${hub.name}) — Icelandic you'll need | AlmiIcelandic`,
    metaDescription: `The Icelandic-language side of working as a ${role.name} in ${hub.name}, Iceland, coming from ${country.name} — how much you'll need, which level, and honest readiness practice. Confirm specifics with employers and regulators.`,
    canonicalPath: path,
    intro: [pick(introVariants, seed)],
    sections: [
      {
        heading: `How much Icelandic does a ${role.name} need?`,
        body: [
          clientFacing
            ? `As a ${role.name}, you'll likely deal with colleagues, clients or patients directly, so employers often expect conversational-to-professional Icelandic — think B1–B2 and up. Even in workplaces that use English, Icelandic widens your options in ${hub.name}.`
            : `A ${role.name} in a technical or international team in ${hub.name} may work largely in English — common in parts of Icelandic tech, tourism and heavy industry. But Icelandic still helps with admin, teammates and everyday life — and it's important if you plan to stay long-term.`,
          `Some professions are regulated and need formal recognition plus a set Icelandic level — confirm the exact requirement with the employer and the relevant Icelandic regulator.`,
        ],
      },
      {
        heading: "Residency, and later citizenship",
        body: [`If working in ${hub.name} is a step toward settling in Iceland, the language matters beyond the job. ${CITIZENSHIP_HEDGE}`],
      },
      {
        heading: "Practise the Icelandic you'll actually use — honestly",
        body: [
          `Practise Reading, Listening, Writing and Speaking at the level you need. ${READINESS_LINE}`,
          CTA_LINE,
        ],
      },
    ],
    faq: [
      { q: `Do I need Icelandic to work as a ${role.name} in Iceland?`, a: `It depends on the role. Client-facing and regulated jobs usually expect B1–B2 or more; some technical roles in ${hub.name} run in English. You'll still need Icelandic for daily life and long-term stay. Confirm with the employer.` },
      { q: `Which Icelandic level should I practise?`, a: `Ríkisborgarapróf (A2) is the citizenship baseline; many jobs want B1–B2. AlmiIcelandic shows an honest readiness band, never an official result.` },
    ],
    related: [
      { href: `/exams/${RIKIS.slug}`, label: `Ríkisborgarapróf (A2) — citizenship language test` },
      { href: `/exams/${CEFR_B1.slug}`, label: `${examLabel(CEFR_B1)} exam guide` },
      ...HUBS.filter((h) => h.slug !== hub.slug).map((h) => ({ href: jobsPath(role.slug, country.slug, h.slug), label: `${role.name} in ${h.name}` })),
    ],
    breadcrumbs: [
      { name: "Work in Iceland", path: "/work-in-iceland" },
      { name: role.name, path: `/work-in-iceland/${role.slug}` },
      { name: `${country.name} · ${hub.name}`, path: path },
    ],
    jsonLd: faqJsonLd([
      { q: `Do I need Icelandic to work as a ${role.name} in Iceland?`, a: `It depends on the role; client-facing and regulated jobs usually expect B1–B2. Confirm with the employer.` },
    ], `${SITE}${path}`, `Work in Iceland as a ${role.name} from ${country.name}`),
  };
}

// ---- EXAM LEVEL PAGE --------------------------------------------------------
export function buildLevelPage(exam: ExamMeta): SeoPage {
  const path = `/exams/${exam.slug}`;
  const isCitizenship = exam.track === "CITIZENSHIP";
  const isUniversity = exam.track === "UNIVERSITY";
  const citizenshipLine = ` It is the Icelandic-language test for citizenship, at A2, overseen by the Ministry of Justice and delivered by the Directorate of Education and School Services (Miðstöð menntunar og skólaþjónustu), covering Reading, Listening, Writing and Speaking.`;
  const universityLine = ` It is the University of Iceland (Háskóli Íslands) Icelandic entrance route for admission to Icelandic-taught programmes, assessing the four language skills at a higher level.`;
  const cefrLine = ` It sits on the general CEFR ladder and assesses Reading (Lestur), Listening (Hlustun), Writing (Ritun) and Speaking (Tal).`;
  const trackLine = isCitizenship ? citizenshipLine : isUniversity ? universityLine : cefrLine;

  return {
    h1: isCitizenship
      ? `${exam.name} (${exam.cefr}) — the Icelandic citizenship language test`
      : `${examLabel(exam)} — Icelandic exam`,
    subtitle: exam.blurb,
    metaTitle: isCitizenship
      ? `${exam.name}: the Icelandic citizenship language test — format & honest practice | AlmiIcelandic`
      : `${examLabel(exam)} — Icelandic exam format & honest practice | AlmiIcelandic`,
    metaDescription: `${examLabel(exam)}: what it tests, how it's structured, and honest readiness practice. ${isCitizenship ? "The language requirement for citizenship — confirm current residency rules with Útlendingastofnun." : "Practice estimate, not an official result."}`,
    canonicalPath: path,
    intro: [
      `${exam.name} sits at CEFR ${exam.cefr}.${trackLine} It assesses Reading, Listening, Writing and Speaking; a strong result means being ready across all four.`,
    ],
    sections: [
      isCitizenship
        ? { heading: "Ríkisborgarapróf, residency and citizenship", body: [CITIZENSHIP_HEDGE] }
        : { heading: `Who ${exam.name} is for`, body: [`${exam.blurb} It suits learners who can already handle Icelandic at roughly ${exam.cefr} and want an honest read on whether they're ready across all four skills.`] },
      {
        heading: "Honest readiness, not a fake score",
        body: [
          `Reading and Listening are auto-marked to a clear per-skill band — Clear or Borderline — against the real criteria. Writing and Speaking get AI feedback labelled an estimate. ${READINESS_LINE}`,
          CTA_LINE,
        ],
      },
      {
        heading: "Prepare by where you're coming from",
        body: [`Studying or working in Iceland? See the language pathway for your situation — from any country, for study or work.`],
      },
    ],
    faq: [
      { q: `What level is ${exam.name}?`, a: `${exam.name} maps to CEFR ${exam.cefr}.` },
      isCitizenship
        ? { q: `Is Ríkisborgarapróf what I need for Icelandic citizenship?`, a: `Passing Ríkisborgarapróf (A2) is the language requirement for naturalisation. There are also residency and other conditions, and rules change — confirm the current requirement with Útlendingastofnun (the Directorate of Immigration). We help you prepare fairly, never to shortcut the process.` }
        : { q: `Is my AlmiIcelandic result official?`, a: `No — it's an honest practice estimate to guide your prep. Only the official assessment issues a real result.` },
    ],
    related: [
      ...ALL_EXAMS.filter((e) => e.slug !== exam.slug).map((e) => ({ href: `/exams/${e.slug}`, label: examLabel(e) })),
    ],
    breadcrumbs: [
      { name: "Icelandic exams", path: "/exams" },
      { name: examLabel(exam), path: path },
    ],
    jsonLd: faqJsonLd(
      [{ q: `What level is ${exam.name}?`, a: `${exam.name} maps to CEFR ${exam.cefr}.` }],
      `${SITE}${path}`,
      `${examLabel(exam)} — Icelandic exam`,
    ),
  };
}

function faqJsonLd(faq: { q: string; a: string }[], url: string, name: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, name, url },
      { "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
}

export { MISSION_LINE };
