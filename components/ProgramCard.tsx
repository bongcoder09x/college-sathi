import Link from "next/link";
import type { Program } from "@/lib/types";
import { getCampus } from "@/lib/data";
import { inrShort } from "@/lib/utils";

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <Link href={`/programs/${program.slug}`} className="card card-hover group flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="badge-green">{program.level}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{program.mode}</span>
      </div>
      <h3 className="h3 mt-4 text-ink group-hover:text-brand-700">{program.name}</h3>
      <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-slate-600">{program.about}</p>
      <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-dashed border-slate-200 pt-4 text-[12px]">
        <div>
          <dt className="text-slate-400">Duration</dt>
          <dd className="mt-0.5 font-semibold text-ink">{program.duration.split(" · ")[0]}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Fees / yr</dt>
          <dd className="mt-0.5 font-semibold text-ink">{inrShort(program.feesPerYear)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Seats</dt>
          <dd className="mt-0.5 font-semibold text-ink">{program.seats}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {program.campuses.map((slug) => (
          <span key={slug} className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-medium text-slate-600">
            {getCampus(slug)?.shortName}
          </span>
        ))}
      </div>
      <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-700">
        Syllabus, fees & FAQs
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition group-hover:translate-x-0.5">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
