import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampus, getProgram, programs } from "@/lib/data";
import { inr } from "@/lib/utils";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const program = getProgram(params.slug);
  if (!program) return { title: "Programme not found" };
  return {
    title: program.name,
    description: `${program.shortName} at College Sathi — ${program.duration}, ${inr(program.feesPerYear)} per year, ${program.seats} seats. Eligibility, syllabus and FAQs.`,
  };
}

export default function ProgramPage({ params }: { params: { slug: string } }) {
  const program = getProgram(params.slug);
  if (!program) notFound();

  const related = programs.filter((p) => p.slug !== program.slug && p.level === program.level).slice(0, 3);
  const totalFees = program.feesPerYear * (parseInt(program.duration, 10) || 1);

  return (
    <div className="shell py-10">
      <nav className="flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span>/</span>
        <Link href="/programs" className="hover:text-brand-700">Programmes</Link>
        <span>/</span>
        <span className="text-ink">{program.shortName}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-green">{program.level}</span>
            <span className="badge-amber">{program.mode}</span>
            <span className="text-[12px] text-slate-500">{program.department}</span>
          </div>
          <h1 className="h1 mt-3 text-ink">{program.name}</h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-slate-600">{program.about}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {program.campuses.map((slug) => (
              <Link key={slug} href={`/campuses/${slug}`} className="chip">
                {getCampus(slug)?.shortName} · {getCampus(slug)?.city}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Eligibility</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-700">{program.eligibility}</p>
            </div>
            <div className="card p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Highlights</p>
              <ul className="mt-2 space-y-1.5">
                {program.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-[13px] text-slate-700">
                    <span className="mt-1 text-brand-600">▸</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="h3">Syllabus</h2>
            <p className="muted mt-1 text-[13px]">NEP 2020 credit framework · 4 credit core papers, 2 credit electives.</p>
            <div className="mt-4 space-y-3">
              {program.syllabus.map((term) => (
                <details key={term.term} className="card group p-0" open={term.term === "Semester 1"}>
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-semibold text-ink marker:content-none">
                    {term.term}
                    <span className="text-[12px] font-normal text-slate-400">{term.papers.length} papers</span>
                  </summary>
                  <div className="border-t border-slate-100 px-5 py-3">
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {term.papers.map((paper) => (
                        <li key={paper} className="rounded-lg bg-slate-50 px-3 py-2 text-[13px] text-slate-700">{paper}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="h3">Frequently asked</h2>
            <div className="mt-4 space-y-3">
              {program.faqs.map((f) => (
                <details key={f.q} className="card p-0">
                  <summary className="cursor-pointer px-5 py-4 text-[14px] font-semibold text-ink marker:content-none">{f.q}</summary>
                  <p className="border-t border-slate-100 px-5 py-4 text-[13.5px] leading-relaxed text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <p className="font-display text-2xl text-ink">{inr(program.feesPerYear)}</p>
            <p className="text-[12px] text-slate-500">per year · tuition only</p>
            <dl className="mt-4 space-y-2.5 border-t border-dashed border-slate-200 pt-4 text-[13px]">
              <Row label="Duration" value={program.duration} />
              <Row label="Total tuition" value={inr(totalFees)} />
              <Row label="Seats" value={`${program.seats} per campus`} />
              <Row label="Mode" value={program.mode} />
              <Row label="Level" value={program.level} />
            </dl>
            <Link href={`/apply?program=${program.slug}`} className="btn-primary mt-5 w-full">Apply for this programme</Link>
            <Link href="/contact" className="btn-outline btn-sm mt-2 w-full">Ask a question</Link>
            <p className="mt-3 text-center text-[11px] text-slate-400">
              Application fee ₹750 · scholarships auto-evaluated
            </p>
          </div>

          <div className="card bg-sand p-5">
            <p className="font-display text-lg">Fee break-up (year 1)</p>
            <dl className="mt-3 space-y-2 text-[12.5px] text-slate-600">
              <Row label="Tuition" value={inr(program.feesPerYear)} />
              <Row label="Library & lab" value={inr(9000)} />
              <Row label="Student welfare" value={inr(3500)} />
              <Row label="Refundable deposit" value={inr(5000)} />
            </dl>
            <p className="mt-3 border-t border-slate-300/60 pt-3 text-[12px] font-semibold text-ink">
              Payable at admission: {inr(program.feesPerYear + 12500)}
            </p>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Similar programmes</p>
            <ul className="mt-3 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/programs/${r.slug}`} className="text-[13px] font-medium text-slate-700 hover:text-brand-700">
                    {r.shortName} · {inr(r.feesPerYear)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}
