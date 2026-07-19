// Real-entity gate — blocks invented messages attributed to real organisations.
//
// Ported from AlmiDutch, where the bank had shipped letters signed by real municipalities
// and seven named businesses, three of which turned out to be real practices. Every one
// survived review, because the surrounding facts were right. That is the danger: an
// invented document reads as credible exactly when nothing else about it is wrong.
//
// Two things this port inherits, both learned the hard way rather than designed in:
//
//   1. IT SCANS PARSED STRINGS, NOT JSON. The first Dutch version scanned
//      JSON.stringify(payload) and was blind to the very violation it was written for:
//      in serialised JSON a newline is a backslash and the LETTER n, so in
//      "hilsen,\nAarhus Kommune" the character before the name is a letter, \b never
//      matches, and a signature sails through. Mid-sentence names were caught, which is
//      why it looked like it worked — but a signature always sits right after a line
//      break. AlmiSwiss had already hit this and fixed it; the lesson was in the network
//      and got reintroduced anyway.
//
//   2. A NAME MUST SIT ON THE SAME LINE AS ITS CATEGORY NOUN ([ \t], not \s). Otherwise
//      a heading followed by an ordinary capitalised word reads as an institution:
//      Dutch produced "buurthuis Elke" (Elke = "every") and Swedish "biblioteket Varje".
//      A gate that reports violations that are not there gets switched off, and then it
//      protects nothing — the same end state as the memory-only rule these replace.
//
// Icelandic shape, which is neither the Dutch nor the Danish one:
//   - Icelandic COMPOUNDS the municipality into a single word: Reykjavíkurborg,
//     Kópavogsbær, Hafnarfjarðarbær. There is no "<Name> kommune" to key on, so the
//     pattern matches the compound suffixes -borg/-bær/-byggð on a capitalised word,
//     plus the explicit "sveitarfélagið <Nafn>" form.
//   - "sveitarfélagið" alone, with no name after it, is the generic usage authors should
//     write and is deliberately left alone.
//
// Deliberately NOT flagged: a real place as setting, a real station in a transport
// announcement, a public body named factually in a knowledge question. Those are
// accurate, not misattributed.

import fs from "node:fs";
import path from "node:path";

const ITEMS_DIR = path.join(process.cwd(), "src", "data", "items");
const problems = [];

// Name + "Kommune"/"Kommunen" as a proper title, on one line.
// Icelandic compounds the municipality into one word — Reykjavíkurborg, Kópavogsbær,
// Hafnarfjarðarbær — so there is no "<Name> kommune" to key on. Two forms are matched:
// the compound suffixes -borg/-bær/-byggð on a capitalised word, and the explicit
// "sveitarfélagið <Nafn>". The suffix on sveitarfélag- is optional and covers the
// inflected forms: the first draft used [ðn] and so missed the DATIVE "sveitarfélaginu
// Kópavogi" entirely — the gate reported clean on an injected violation, which is how
// the hole was found.
//
// "sveitarfélagið" with no name after it is the generic usage authors should write and
// is deliberately left alone.
const MUNICIPALITY_AS_ACTOR =
  /\bsveitarfélagi(?:ð|nu|ns|n)?[ \t]+([A-ZÁÉÍÓÚÝÞÆÖ][a-zá-úýþæö]+)|\b([A-ZÁÉÍÓÚÝÞÆÖ][a-zá-úýþæö]{3,}(?:borg|bær|byggð))\b/g;

// -bær is not only a place suffix in Icelandic; it is also a productive ADJECTIVE
// ending. "Sjálfbær nýting" means "sustainable utilisation", and the capital is there
// only because it opens a sentence — the scan reported it twice as a municipality.
// Sentence position cannot separate the two, because a real signature (Reykjavíkurborg)
// sits line-initial as well, so the exception has to be lexical. The gate prints the
// exact token it matched, which is what makes additions here obvious rather than
// guesswork.
const NOT_PLACE_NAMES = new Set(["sjálfbær", "aðgengilegur", "nothæfur", "greiðslubær"]);

const CATEGORY_NOUNS = [
  "heilsugæslan", "heilsugæslustöðin", "tannlæknastofan", "apótekið", "sjúkrahúsið",
  "skólinn", "grunnskólinn", "leikskólinn", "bókasafnið", "sundlaugin",
  "verslunin", "búðin", "matvöruverslunin", "leigusalinn", "íþróttafélagið",
  "tungumálaskólinn", "stéttarfélagið", "bankinn", "tryggingafélagið",
];
const NAMED_BUSINESS = new RegExp(
  `\\b(${CATEGORY_NOUNS.join("|")})[ \\t]+([A-ZÁÉÍÓÚÝÞÆÖ][a-zá-úýþæö]{2,})`,
  "g",
);

// Helvetia class: a real firm signing an invented letter.
// Brands whose names are NOT everyday words. Deliberately excluded: Síminn (the
// telephone), Strætó (the bus), Nettó (net/netto), Veitur (utilities) and Iceland (the
// country). Each is a real company AND an ordinary Icelandic word, so matching the name
// alone produces false positives, not detections — this scan flagged "Síminn minn er
// fimm…" ("my phone is 5…") and "Jón tekur strætó" ("Jón takes the bus"), both of which
// are simply correct Icelandic. A brand that shares a common noun cannot be caught by
// name; it needs surrounding context, and a gate that cries wolf gets switched off.
//
// Note also that JavaScript's  is ASCII-only, so it behaves unpredictably around
// á/æ/ð/þ/ó. Word-boundary matching is not reliable for Icelandic and the list is kept
// to multi-word or unambiguous names for that reason too.
const BRAND_DENYLIST = [
  "Bónus", "Krónan", "Hagkaup", "Fjarðarkaup",
  "Landsbankinn", "Íslandsbanki", "Arion banki", "Sjóvá", "TM tryggingar",
  "Icelandair", "Lyf og heilsa", "Húsasmiðjan", "Elko",
];

// Collect every string in a payload, so patterns run against real text with real
// boundaries — never against escaped JSON.
function strings(v, out = []) {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) for (const x of v) strings(x, out);
  else if (v && typeof v === "object") for (const x of Object.values(v)) strings(x, out);
  return out;
}

let scanned = 0;
for (const file of fs.readdirSync(ITEMS_DIR).filter((f) => f.endsWith(".json"))) {
  const raw = JSON.parse(fs.readFileSync(path.join(ITEMS_DIR, file), "utf8"));
  for (const [i, item] of (raw.items ?? raw).entries()) {
    scanned++;
    const where = `${file}[${i}] "${item.title}"`;
    for (const text of strings(item.payload)) {
      for (const m of text.matchAll(MUNICIPALITY_AS_ACTOR)) {
        if (NOT_PLACE_NAMES.has(m[0].toLowerCase())) continue;
        problems.push(`${where}: names a municipality — "${m[0]}". Use "sveitarfélagið" with no name; a real municipality must never author invented text.`);
      }
      for (const m of text.matchAll(NAMED_BUSINESS)) {
        problems.push(`${where}: names an institution — "${m[1]} ${m[2]}". Use the bare category ("${m[1]}").`);
      }
      for (const brand of BRAND_DENYLIST) {
        if (new RegExp(`\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text)) {
          problems.push(`${where}: names a real company — "${brand}". Use a generic category.`);
        }
      }
    }
  }
}

if (problems.length) {
  console.error(`\nREAL-ENTITY GATE FAILED — ${problems.length} problem(s) across ${scanned} items:\n`);
  for (const p of [...new Set(problems)]) console.error(`  ✗ ${p}`);
  console.error("\nAn invented letter, call or notice must not carry a real organisation's name.\nReal places as SETTING are fine and are not flagged.\n");
  process.exit(1);
}
console.log(`real-entity gate: ${scanned} items clean (no invented text attributed to a named organisation)`);
