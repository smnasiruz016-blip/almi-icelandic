// AlmiIcelandic — shared type contracts for the three-track item bank.
// String-literal unions mirror the Prisma enums (kept in sync by hand) so the
// scoring engine, content pipeline, and UI don't depend on the generated client.

export type IcelandicTrack = "CITIZENSHIP" | "UNIVERSITY" | "CEFR";

// Track A — Ríkisborgarapróf (citizenship test, A2, four skills).
export type CitizenshipExam = "RIKISBORGARAPROF_A2";
// Track B — University of Iceland (HÍ) Icelandic entrance exam.
export type UniversityExam = "HI_ENTRANCE";
// Track C — general CEFR ladder A1–C1.
export type CefrExam = "CEFR_A1" | "CEFR_A2" | "CEFR_B1" | "CEFR_B2" | "CEFR_C1";
export type IcelandicExam = CitizenshipExam | UniversityExam | CefrExam;

// The four language skills are shared by all three tracks.
export type LanguageSkill = "READING" | "LISTENING" | "WRITING" | "SPEAKING";
export type IcelandicSkill = LanguageSkill;

export type IcelandicTaskType =
  | "MCQ_SINGLE"
  | "MATCHING"
  | "CLOZE"
  | "ORDERING"
  | "TRUE_FALSE"
  | "WRITING_PROMPT"
  | "SPEAKING_PROMPT";

export type IcelandicDifficulty = "FOUNDATION" | "CORE" | "STRETCH";

// The CEFR level a single task is PITCHED at — distinct from `difficulty`, which is a
// FOUNDATION/CORE/STRETCH ladder *inside* an exam and crosses levels freely. Level is
// what the goal-readiness band keys on (via almi-data's splitByLevel); difficulty is
// only for ordering/variety. Optional: an untagged task is UNDECLARED and never
// silently counted as at-goal. Re-exported CefrLevel from the canonical rule package.
export type { CefrLevel } from "@smnasiruz016-blip/almi-data";

export const OBJECTIVE_TASK_TYPES: IcelandicTaskType[] = [
  "MCQ_SINGLE",
  "MATCHING",
  "CLOZE",
  "ORDERING",
  "TRUE_FALSE",
];

export const PRODUCTIVE_TASK_TYPES: IcelandicTaskType[] = [
  "WRITING_PROMPT",
  "SPEAKING_PROMPT",
];

export function isObjectiveTask(t: IcelandicTaskType): boolean {
  return OBJECTIVE_TASK_TYPES.includes(t);
}

/** A skill is "free to taste" (auto-graded) vs gated (AI-graded / mock).
 *  Free taste = Reading + Listening (objective, auto-graded).
 *  Gated = Writing + Speaking (AI-graded) + the full mock. */
export function isFreeSkill(skill: IcelandicSkill): boolean {
  return skill === "READING" || skill === "LISTENING";
}

// ---- Task payload shapes (validated in items.ts) ----

/** One multiple-choice / true-false option group. */
export interface McqPayload {
  passage?: string; // reading passage (READING) — omitted for LISTENING
  transcript?: string; // listening transcript (LISTENING) — rendered as audio via TTS
  question: string;
  options: string[]; // 3–4 options
}

export interface MatchingPayload {
  transcript?: string;
  passage?: string;
  instructions: string;
  left: string[]; // prompts
  right: string[]; // candidate matches (may include distractors)
}

export interface ClozePayload {
  passage: string; // text with {{1}} {{2}} … gap markers
  gaps: { id: number; options: string[] }[];
}

export interface OrderingPayload {
  instructions: string;
  items: string[]; // presented shuffled; answer = correct order of indices
}

/** Objective answer keys keyed by taskType. */
export type ObjectiveAnswer =
  | { type: "MCQ_SINGLE"; correctIndex: number }
  | { type: "TRUE_FALSE"; correctIndex: number }
  | { type: "MATCHING"; pairs: [number, number][] } // [leftIndex, rightIndex]
  | { type: "CLOZE"; correct: { id: number; index: number }[] }
  | { type: "ORDERING"; order: number[] };

/** Productive prompt (Writing / Speaking) — AI-graded. */
export interface ProductivePayload {
  stimulus?: string; // context / situation (IS)
  criteria: string[]; // what the answer must show (feeds AI feedback)
  charBand?: { min: number; max: number }; // writing length guidance
  minSeconds?: number; // speaking guidance
}
