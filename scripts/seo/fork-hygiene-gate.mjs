// Build-time FORK HYGIENE GATE — the AlmiWorld §7 rule, enforced instead of trusted.
//
// WHY THIS EXISTS. This repo's lineage is:
//   almi-celpip → almi-goethe → almi-icelandic (you are here)
// Two ancestors, two leak surfaces: AlmiCELPIP (Canadian ENGLISH — CELPIP, the CLB
// framework, IRCC immigration) and AlmiGoethe (GERMAN — Goethe-Zertifikat, TestDaF,
// telc, the German skill words). An Icelandic product has no reason to name a Canadian
// benchmark or a German certificate; where it does, the fork copied a label and left the
// fact behind.
//
// The recurring lesson down this chain (documented in almi-swiss): the dangerous case is
// the LABEL localized while the FACT was not, and an identifier shipped in a spelling the
// banned list didn't hold (almi-swiss's SESSION_COOKIE was "almi_norwegian_session" while
// its list held only the HYPHEN form). Product names are ENUMERATED in all four shapes.
//
// Runs before the build and FAILS it on any hit. AlmiDanish descends from this repo: when
// re-cutting there, ADD the Icelandic nouns (they become ancestor leaks) and REMOVE what
// Denmark legitimately owns.
//
// ⚠️ TWO per-language cautions specific to this fork:
//  1. German SKILL WORDS (Schreiben/Sprechen/Hören/Lesen) are banned by WORD BOUNDARY,
//     case-sensitive — NOT as substrings. Icelandic legitimately contains "lesendahópa",
//     "samtímalesendum", "lesenda"; a substring ban on "Lesen" would false-red them.
//     \bLesen\b (capital L) matches only the standalone German noun, never those words.
//  2. Bare country names are NOT banned — an Icelandic item may name countries as content.
//     Icelandic's own nouns (Ríkisborgarapróf, Útlendingastofnun, Háskóli Íslands, is-IS)
//     must NEVER be added — they are this product's subject matter.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src", "scripts", "prisma"];
const SCAN_EXT = /\.(ts|tsx|js|mjs|json|prisma|css|md)$/;

const ALLOWLIST = new Map([
  ["src/lib/nav/family.ts", "links to sibling AlmiWorld products by name"],
  ["scripts/seo/fork-hygiene-gate.mjs", "documents the banned nouns"],
]);

const LINE_ESCAPE = "hygiene-allow";

// Ancestor (CELPIP + Goethe) proper nouns. ⚠️ RE-CUT AT EVERY FORK. Distinctive nouns only,
// as substrings; the ambiguous skill words go in BANNED_WORD below with a boundary.
const BANNED = [
  // — CELPIP (root ancestor) — Canadian English test + framework —
  "CELPIP", "Canadian Language Benchmark",
  "Immigration, Refugees and Citizenship Canada",
  // — Goethe (immediate ancestor) — German institution / exam / locale —
  "Goethe-Institut", "Goethe-Zertifikat", "TestDaF",
  "de-DE",
  // Sibling/ancestor PRODUCT names appended below — GENERATED, not hand-listed.
];

const ANCESTOR_PRODUCTS = ["celpip", "goethe"];
/** Every form a product slug ships in: almi-x · almi_x · almix · AlmiX. */
function productNameForms(p) {
  return [`almi-${p}`, `almi_${p}`, `almi${p}`, `Almi${p[0].toUpperCase()}${p.slice(1)}`];
}
for (const p of ANCESTOR_PRODUCTS) BANNED.push(...productNameForms(p));
BANNED.push("AlmiCELPIP");

// SELF-CHECK — a global find-replace can rewrite this list to ban our own name.
const SELF_NAMES = ["AlmiIcelandic", "almi-icelandic", "almi_icelandic", "almiicelandic"];
for (const n of SELF_NAMES) {
  if (BANNED.some((b) => b.toLowerCase() === n.toLowerCase())) {
    console.error("");
    console.error(`FORK-HYGIENE GATE IS MISCONFIGURED: BANNED contains "${n}", which is THIS product's own name.`);
    console.error("Every legitimate mention of ourselves would be reported as an ancestor leak. Fix BANNED.");
    console.error("");
    process.exit(2);
  }
}

// Word-boundary bans — collide with ordinary substrings, so they need \b. Case matters:
// German nouns are Capitalised; \bLesen\b (capital L) matches the German word but NOT the
// Icelandic "lesendahópa"/"lesenda". CLB/IRCC are Canadian acronyms; telc is lowercase.
const BANNED_WORD = ["CLB", "IRCC", "telc", "Schreiben", "Sprechen", "Hören", "Lesen"];

// ── Scanning machinery (real-entity-gate design: strip comments, scan STRING values).

function stripComments(text) {
  let out = "";
  let i = 0;
  let quote = null;
  let inLine = false;
  let inBlock = false;
  while (i < text.length) {
    const c = text[i];
    const n = text[i + 1];
    if (inLine) {
      if (c === "\n") { inLine = false; out += c; }
      else out += " ";
      i++; continue;
    }
    if (inBlock) {
      if (c === "*" && n === "/") { inBlock = false; out += "  "; i += 2; continue; }
      out += c === "\n" ? c : " ";
      i++; continue;
    }
    if (quote) {
      if (c === "\\") { out += text.slice(i, i + 2); i += 2; continue; }
      if (c === quote) quote = null;
      out += c; i++; continue;
    }
    if (c === '"' || c === "'" || c === "`") { quote = c; out += c; i++; continue; }
    if (c === "/" && n === "/") { inLine = true; out += "  "; i += 2; continue; }
    if (c === "/" && n === "*") { inBlock = true; out += "  "; i += 2; continue; }
    out += c; i++;
  }
  return out;
}

// Prisma comments are `//` and `///` — NOT `#`. stripComments handles `//` while
// respecting string literals, so prisma reuses it.

function jsonStrings(node, out = []) {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) for (const v of node) jsonStrings(v, out);
  else if (node && typeof node === "object") for (const v of Object.values(node)) jsonStrings(v, out);
  return out;
}

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    if (e === "node_modules" || e === ".next" || e === ".git") continue;
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCAN_EXT.test(e)) out.push(full);
  }
  return out;
}

const violations = [];

for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file).replace(/\\/g, "/");
    if (ALLOWLIST.has(rel)) continue;
    const raw = readFileSync(file, "utf8");
    let text;
    if (rel.endsWith(".json")) {
      try { text = jsonStrings(JSON.parse(raw)).join("\n"); }
      catch { text = raw; }
    } else if (rel.endsWith(".prisma")) {
      text = stripComments(raw);   // prisma comments are //
    } else {
      text = stripComments(raw);
    }
    const lines = text.split(/\r?\n/);
    const rawLines = raw.split(/\r?\n/);

    lines.forEach((line, i) => {
      if ((rawLines[i] ?? "").includes(LINE_ESCAPE)) return;
      for (const term of BANNED) {
        if (line.includes(term)) {
          violations.push(`${rel}:${i + 1}  banned ancestor noun "${term}"\n      ${line.trim().slice(0, 120)}`);
        }
      }
      for (const term of BANNED_WORD) {
        if (new RegExp(`\\b${term}\\b`).test(line)) {
          violations.push(`${rel}:${i + 1}  banned ancestor noun "${term}"\n      ${line.trim().slice(0, 120)}`);
        }
      }
    });
  }
}

if (violations.length) {
  console.error("\n✗ FORK HYGIENE GATE FAILED — ancestor content found.\n");
  console.error("  Iceland must read as Iceland. These are leaks from the fork lineage");
  console.error("  (celpip → goethe → icelandic).\n");
  for (const v of [...new Set(violations)]) console.error(`  ${v}`);
  console.error(`\n  ${violations.length} violation(s). Fix the FACT, not just the label.\n`);
  process.exit(1);
}

console.log(`✓ Fork hygiene gate: clean (no ancestor nouns across ${SCAN_DIRS.join(", ")}).`);
