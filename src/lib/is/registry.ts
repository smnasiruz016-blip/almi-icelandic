// AlmiIcelandic — the "Choose a Test" tree + exam metadata.
// Three tracks → exams → skills. Drives navigation, content filtering, and the
// honest readiness thresholds used by the scoring engine. All "pass" figures are
// framed as READINESS estimates, never the official Directorate / Ministry result.

import type {
  IcelandicTrack,
  IcelandicExam,
  CitizenshipExam,
  UniversityExam,
  CefrExam,
  IcelandicSkill,
  LanguageSkill,
} from "./types";

export interface ExamMeta {
  exam: IcelandicExam;
  track: IcelandicTrack;
  slug: string; // URL slug
  name: string; // display name
  cefr: string; // CEFR level label
  blurb: string; // one-line description
  skills: IcelandicSkill[];
  lead?: boolean; // citizenship-relevant (Ríkisborgarapróf) — the lead hook
  mockMinutes: number; // full timed mock duration guidance
}

// Per-skill readiness thresholds (honest). The exams are pass/fail against
// official criteria; we show a per-skill readiness band as an estimate, clearly
// labelled — never an official Directorate of Education / Ministry result.
export const READY_PCT = 70; // CLEAR — comfortably meeting the level's demands
export const BORDERLINE_PCT = 55; // BORDERLINE — close, needs consolidation

export const LANGUAGE_SKILLS: LanguageSkill[] = ["READING", "LISTENING", "WRITING", "SPEAKING"];

export const SKILL_LABELS: Record<IcelandicSkill, { is: string; en: string }> = {
  READING: { is: "Lestur", en: "Reading" },
  LISTENING: { is: "Hlustun", en: "Listening" },
  WRITING: { is: "Ritun", en: "Writing" },
  SPEAKING: { is: "Tal", en: "Speaking" },
};

// Track A — Ríkisborgarapróf: the Icelandic language test for citizenship. A2
// across all four skills. Overseen by the Ministry of Justice, delivered by the
// Directorate of Education and School Services (Miðstöð menntunar og
// skólaþjónustu). Passing it is the language requirement for Icelandic
// citizenship — but confirm the current residency rule with Útlendingastofnun.
export const CITIZENSHIP_EXAMS: ExamMeta[] = [
  {
    exam: "RIKISBORGARAPROF_A2", track: "CITIZENSHIP", slug: "rikisborgaraprof", name: "Ríkisborgarapróf", cefr: "A2",
    blurb: "The Icelandic language test for citizenship — A2 across Reading, Listening, Writing and Speaking.",
    skills: ["READING", "LISTENING", "WRITING", "SPEAKING"], lead: true, mockMinutes: 120,
  },
];

// Track B — University of Iceland (Háskóli Íslands) Icelandic entrance exam, for
// applicants to programmes taught in Icelandic — a higher-level proficiency route.
export const UNIVERSITY_EXAMS: ExamMeta[] = [
  {
    exam: "HI_ENTRANCE", track: "UNIVERSITY", slug: "university-entrance", name: "University of Iceland entrance exam", cefr: "B2",
    blurb: "Icelandic proficiency for admission to Icelandic-taught programmes at the University of Iceland.",
    skills: ["READING", "LISTENING", "WRITING", "SPEAKING"], mockMinutes: 150,
  },
];

// Track C — general CEFR Icelandic ladder, self-study feeding the two exam tracks.
export const CEFR_EXAMS: ExamMeta[] = [
  {
    exam: "CEFR_A1", track: "CEFR", slug: "cefr-a1", name: "Icelandic A1", cefr: "A1",
    blurb: "Absolute-beginner Icelandic — everyday words, phrases and very simple exchanges.",
    skills: ["READING", "LISTENING", "WRITING", "SPEAKING"], mockMinutes: 60,
  },
  {
    exam: "CEFR_A2", track: "CEFR", slug: "cefr-a2", name: "Icelandic A2", cefr: "A2",
    blurb: "Elementary Icelandic — manage simple, routine situations in school, work and daily life.",
    skills: ["READING", "LISTENING", "WRITING", "SPEAKING"], mockMinutes: 90,
  },
  {
    exam: "CEFR_B1", track: "CEFR", slug: "cefr-b1", name: "Icelandic B1", cefr: "B1",
    blurb: "Intermediate Icelandic — handle most everyday situations and describe experiences and plans.",
    skills: ["READING", "LISTENING", "WRITING", "SPEAKING"], mockMinutes: 120,
  },
  {
    exam: "CEFR_B2", track: "CEFR", slug: "cefr-b2", name: "Icelandic B2", cefr: "B2",
    blurb: "Upper-intermediate Icelandic — follow complex texts and interact with fluency and spontaneity.",
    skills: ["READING", "LISTENING", "WRITING", "SPEAKING"], mockMinutes: 150,
  },
  {
    exam: "CEFR_C1", track: "CEFR", slug: "cefr-c1", name: "Icelandic C1", cefr: "C1",
    blurb: "Advanced Icelandic — use the language flexibly for academic, social and professional purposes.",
    skills: ["READING", "LISTENING", "WRITING", "SPEAKING"], mockMinutes: 180,
  },
];

export const ALL_EXAMS: ExamMeta[] = [...CITIZENSHIP_EXAMS, ...UNIVERSITY_EXAMS, ...CEFR_EXAMS];

export function examBySlug(slug: string): ExamMeta | undefined {
  return ALL_EXAMS.find((e) => e.slug === slug);
}

export function examsByTrack(track: IcelandicTrack): ExamMeta[] {
  return ALL_EXAMS.filter((e) => e.track === track);
}

export function isCitizenshipExam(exam: IcelandicExam): exam is CitizenshipExam {
  return exam === "RIKISBORGARAPROF_A2";
}

export function isUniversityExam(exam: IcelandicExam): exam is UniversityExam {
  return exam === "HI_ENTRANCE";
}

export function isCefrExam(exam: IcelandicExam): exam is CefrExam {
  return exam.startsWith("CEFR_");
}
