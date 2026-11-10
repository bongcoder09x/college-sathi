import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { campuses, getCampus, programs } from "@/lib/data";
import { inrShort } from "@/lib/utils";

export function generateStaticParams() {
  return campuses.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const campus = getCampus(params.slug);
  return { title: campus ? campus.shortName : "Campus" };
}

export default function CampusPage({ params }: { params: { slug: string } }) {
  const campus = getCampus(params.slug);
  if (!campus) notFound();
  const campusPrograms = programs.filter((p) => p.campuses.includes(campus.slug));

  return (
    <div className="shell py-10">
      <div className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${campus.gallery[0].tone} px-8 py-12 text-white sm:px-12`}>
        <div className="absolute inset-0 grain opacity-20" aria-hidden />
        <p className="relative text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
          {campus.city} · established {campus.established}
        </p>
        <h1 className="relative mt-2 font-display text-4xl leading-tight sm:text-5xl">{campus.name}</h1>
        <p className="relative mt-3 max-w-2xl text-[15px] leading-relaxed text-white/85">{campus.tagline}. {campus.facilities.length} facilities on site, {campusPrograms.length} programmes running this session.</p>
        <div className="relative mt-6 flex flex-wrap gap-3">
          <Link href="/apply" className="btn-accent btn-sm">Apply to {campus.shortName}</Link>
          <Link href="/contact" className="btn btn-sm border border-white/30 text-white hover:bg-white/10">Book a visit</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {campus.stats.map((s) => (
              <div key={s.label} className="card p-4">
                <p className="font-display text-2xl text-ink">{s.value}</p>
                <p className="text-[11.5px] uppercase tracking-wide text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          <section className="mt-8">
            <h2 className="h3">Facilities</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {campus.facilities.map((f) => (
                <li key={f} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-700">
                  <span className="mt-0.5 text-brand-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="h3">Gallery</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {campus.gallery.map((g) => (
                <figure key={g.title} className={`relative h-40 overflow-hidden rounded-xl2 bg-gradient-to-br ${g.tone}`}>
                  <div className="absolute inset-0 grain opacity-20" />
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-3 text-[12.5px] font-semibold text-white">
                    {g.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="h3">Programmes at {campus.shortName}</h2>
            <div className="mt-4 overflow-hidden rounded-xl2 border border-slate-200 bg-white">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Programme</th>
                    <th className="px-4 py-3">Level</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3 text-right">Fees / yr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {campusPrograms.map((p) => (
                    <tr key={p.slug} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <Link href={`/programs/${p.slug}`} className="font-medium text-ink hover:text-brand-700">{p.name}</Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.level}</td>
                      <td className="px-4 py-3 text-slate-600">{p.duration.split(" · ")[0]}</td>
                      <td className="px-4 py-3 text-right font-semibold">{inrShort(p.feesPerYear)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="card overflow-hidden">
            <div className="relative h-44 bg-slate-100">
              <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "linear-gradient(90deg,#e2e8f0 1px,transparent 1px),linear-gradient(#e2e8f0 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white shadow-lift">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                </span>
                <p className="mt-2 rounded-full bg-white/90 px-3 py-1 text-[11.5px] font-semibold text-ink">{campus.shortName}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="font-display text-lg">Visit us</p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{campus.address}</p>
              <dl className="mt-3 space-y-1.5 text-[13px]">
                <div className="flex justify-between gap-2"><dt className="text-slate-500">Phone</dt><dd className="font-medium text-ink">{campus.phone}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-slate-500">Email</dt><dd className="font-medium text-ink">{campus.email}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-slate-500">Office</dt><dd className="font-medium text-ink">9 AM – 6 PM</dd></div>
              </dl>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(campus.address)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline btn-sm mt-4 w-full"
              >
                Open in maps
              </a>
            </div>
          </div>
          <div className="card bg-brand-900 p-5 text-white">
            <p className="font-display text-lg">Admission desk</p>
            <p className="mt-2 text-[13px] leading-relaxed text-brand-100">
              Campus counsellors answer admission questions in Bengali, Hindi and English.
            </p>
            <Link href="/apply" className="btn-accent btn-sm mt-4 w-full">Start application</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
