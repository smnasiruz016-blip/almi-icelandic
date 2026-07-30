// REBALANCE THE TRUE/FALSE VALUE AXIS.
//
// WHY THIS EXISTS, AND WHY IT IS SEPARATE FROM degame-options.mts.
//
// De-gaming POSITION exposed a second defect underneath it. In two sections every single
// true/false statement was FALSE — CEFR_B2::READING (3 of 3) and HI_ENTRANCE::LISTENING
// (4 of 4). "Answer Rangt to everything" scored 100% on both. While the keys were also
// clustered on one index the two defects were collinear and only position was visible;
// balancing position separated them and the value clustering stood up on its own.
//
// The audit files this as B1v at P3 on the reasoning that a value axis is usually an
// option ID the learner never sees. That is true for goethe and French and WRONG here:
// these options render as their own text, so "Rétt" / "Rangt" IS the label on screen and
// the value axis is exactly as exploitable as position.
//
// THIS ONE CANNOT BE FIXED BY PERMUTATION. Position was a presentation defect and could
// be shuffled. Truth value is a property of the CLAIM, so the only honest fix is to
// rewrite some statements so that they are genuinely true of their own passage. That is
// authoring, so every rewrite below is listed explicitly with the source sentence that
// makes it true — no rule, no transformation, nothing generated, and nothing taken from
// a sibling product. A reviewer can check each one against the passage in the same file.
//
// Only the MINIMUM number of statements is flipped, and deliberately not all of them:
// an all-true section is the same defect wearing the other coat.
//   CEFR_B2::READING       3 items → 2 true / 1 false
//   HI_ENTRANCE::LISTENING 4 items → 2 true / 2 false
//
// The false statements that remain are left exactly as they are. A false statement is
// not a defect; a section of only false statements is.
//
// ── A SECOND, SEPARATE BUG FIXED HERE, FLAGGED NOT SMUGGLED ─────────────────────
// ObjectiveTask.tsx renders `p.question` (line 75). Four items in this bank carry their
// text under `statement` instead and have no `question` at all, so they render a passage
// and a row of buttons with NO QUESTION ON SCREEN. `McqPayload.question` is typed
// required, but bundle JSON is cast rather than parsed, so tsc never saw it.
//
// Two of the four are in the sections above; the other two are CEFR_B2::LISTENING
// "Weather warning" and "Museum tour info". All four are renamed here. The rename moves
// no content — the authored text is identical, character for character — it just puts it
// in the field that ships. Fixing only the two I had to touch would have left two items
// live and blank in the same file, which is worse than a small, stated scope extension.
//
// Run BEFORE degame-options.mts: flipping which option is correct changes the position
// distribution, so positions are rebalanced afterwards.

import fs from "node:fs";
import path from "node:path";

const ITEMS_DIR = path.join(process.cwd(), "src", "data", "items");

/** Each entry: the item to rewrite, its new statement, and the sentence in its OWN
 *  passage/transcript that makes the new statement true. `evidence` is not used by the
 *  code — it is here so the claim can be checked without opening another file. */
const REWRITES: {
  file: string; index: number; title: string; statement: string; evidence: string;
}[] = [
  // ── CEFR_B2::READING — 2 of 3 become true ──
  {
    file: "cefr-b2-2.json", index: 5, title: "Recycling claim",
    statement: "Samkvæmt textanum þarf einnig að draga úr neyslu og huga að hönnun umbúða frá upphafi.",
    evidence: "\"Þeir leggja áherslu á að draga þurfi úr neyslu og hönnun umbúða frá upphafi.\"",
  },
  {
    file: "cefr-b2.json", index: 1, title: "Ný fjarvinnustefna fyrirtækisins",
    statement: "Starfsfólk þarf samþykki næsta yfirmanns til að vinna heiman frá sér.",
    evidence: "\"…að því gefnu að næsti yfirmaður samþykki fyrirkomulagið…\"",
  },
  // cefr-b2-2.json[6] "Four-day week" stays FALSE — the section needs a genuine mix.

  // ── HI_ENTRANCE::LISTENING — 2 of 4 become true ──
  {
    file: "university-listening.json", index: 2, title: "Tilkynning frá skrifstofu deildar",
    statement: "Prófið hefst klukkan níu að morgni í stofu hundrað og tvö í Árnagarði.",
    evidence: "\"Prófið verður áfram haldið í stofu hundrað og tvö í Árnagarði og hefst klukkan níu að morgni.\"",
  },
  {
    file: "university-listening.json", index: 9, title: "Fyrirlestur um endurnýjanlega orku",
    statement: "Samkvæmt fyrirlesaranum losnar brennisteinsvetni við vinnslu jarðvarma.",
    evidence: "\"Við vinnsluna losnar til dæmis brennisteinsvetni og lítilræði af koltvísýringi.\"",
  },
  // university-listening.json[5] "Erindi um íslenska handritamenningu" and [13]
  // "Tilkynning um bókasafnið" stay FALSE.
];

/** The four items whose authored text sits under `statement` and therefore never
 *  reaches the screen. Rename only — the string itself is untouched. */
const FIELD_RENAMES: { file: string; index: number; title: string }[] = [
  { file: "cefr-b2-2.json", index: 5, title: "Recycling claim" },
  { file: "cefr-b2-2.json", index: 6, title: "Four-day week" },
  { file: "cefr-b2-2.json", index: 16, title: "Weather warning" },
  { file: "cefr-b2-2.json", index: 17, title: "Museum tour info" },
];

const banks = new Map<string, any[]>();
const load = (f: string) => {
  if (!banks.has(f)) banks.set(f, JSON.parse(fs.readFileSync(path.join(ITEMS_DIR, f), "utf8")));
  return banks.get(f)!;
};

console.log("── field rename: statement → question (authored text unchanged) ──");
for (const r of FIELD_RENAMES) {
  const it = load(r.file)[r.index];
  if (!it) throw new Error(`${r.file}[${r.index}] does not exist`);
  if (it.title !== r.title) throw new Error(`${r.file}[${r.index}] is "${it.title}", expected "${r.title}"`);
  if (it.payload.question !== undefined) { console.log(`  – ${r.title} already has question; skipped`); continue; }
  it.payload.question = it.payload.statement;
  delete it.payload.statement;
  console.log(`  ✓ ${r.file}[${r.index}] ${r.title}`);
}

console.log("\n── statements rewritten to be TRUE of their own source ──");
let changed = 0;
for (const r of REWRITES) {
  const it = load(r.file)[r.index];
  if (!it) throw new Error(`${r.file}[${r.index}] does not exist`);
  if (it.title !== r.title) {
    // The index is a position in a file other passes also edit. Asserting the title
    // makes a silent mis-target impossible: rewriting the WRONG item's statement would
    // produce a fluent, plausible, false question — the worst outcome here.
    throw new Error(`${r.file}[${r.index}] is "${it.title}", expected "${r.title}" — refusing to rewrite the wrong item`);
  }
  if (it.answer?.type !== "TRUE_FALSE") throw new Error(`${r.file}[${r.index}] is not TRUE_FALSE`);
  const rett = it.payload.options.indexOf("Rétt");
  if (rett < 0) throw new Error(`${r.file}[${r.index}] has no "Rétt" option: ${JSON.stringify(it.payload.options)}`);

  const before = it.payload.question ?? it.payload.statement;
  it.payload.question = r.statement;
  delete it.payload.statement;
  it.answer.correctIndex = rett;
  changed++;
  console.log(`  ✓ ${r.file}[${r.index}] ${r.title}`);
  console.log(`      before: ${before}`);
  console.log(`      after:  ${r.statement}   → Rétt`);
  console.log(`      source: ${r.evidence}`);
}

for (const [f, items] of banks) {
  fs.writeFileSync(path.join(ITEMS_DIR, f), JSON.stringify(items, null, 2) + "\n", "utf8");
}
console.log(`\n${changed} statement(s) rewritten; ${FIELD_RENAMES.length} field(s) renamed; ${banks.size} bundle(s) written.`);
console.log("Now re-run scripts/items/degame-options.mts to rebalance POSITION.");
