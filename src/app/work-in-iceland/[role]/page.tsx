import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROLE_BY_SLUG, ROLES, COUNTRIES, HUBS, jobsPath } from "@/lib/seo/axes";

export const dynamicParams = false;
export function generateStaticParams() { return ROLES.map((r) => ({ role: r.slug })); }

type Params = Promise<{ role: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { role } = await params;
  const r = ROLE_BY_SLUG.get(role);
  if (!r) return { title: "Not found" };
  return {
    title: { absolute: `Work in Iceland as a ${r.name} — Icelandic you'll need | AlmiIcelandic` },
    description: `How much Icelandic a ${r.name} needs in Iceland, which CEFR level, and honest readiness practice — by country of origin and city.`,
    alternates: { canonical: `/work-in-iceland/${r.slug}` },
  };
}

export default async function RoleHub({ params }: { params: Params }) {
  const { role } = await params;
  const r = ROLE_BY_SLUG.get(role);
  if (!r) notFound();
  const sample = COUNTRIES.slice(0, 60);
  return (
    <main className="bg-almi-bg text-almi-text">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-almi-text-muted">
          <Link href="/work-in-iceland" className="hover:text-almi-coral">Work in Iceland</Link> / {r.name}
        </nav>
        <h1 className="text-3xl font-semibold text-almi-ink sm:text-4xl">Work in Iceland as a {r.name}</h1>
        <p className="mt-3 max-w-2xl text-base text-almi-text">
          The Icelandic you need as a {r.name} depends on the setting and city. Pick where you're coming from and the
          hub you're targeting — Reykjavík, Akureyri, Reykjanesbær and other regions — or start practising Icelandic now.
        </p>
        <div className="mt-6">
          <Link href="/exams/rikisborgaraprof" className="text-sm font-semibold text-almi-coral hover:underline">Ríkisborgarapróf (A2) — citizenship language test →</Link>
        </div>
        <h2 className="mt-10 text-lg font-semibold text-almi-ink">By country of origin</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {sample.map((c) => (
            <li key={c.slug}>
              <Link href={jobsPath(r.slug, c.slug, HUBS[0].slug)} className="inline-block rounded-full border border-almi-bg-peach bg-almi-paper px-3 py-1.5 text-sm text-almi-ink hover:border-almi-coral">
                {c.flag} {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
