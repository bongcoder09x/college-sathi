import Link from "next/link";
import { campuses } from "@/lib/data";

export const metadata = { title: "Campuses" };

export default function CampusesPage() {
  return (
    <div className="shell py-12">
      <p className="eyebrow">Four campuses</p>
      <h1 className="h1 mt-2 text-ink">Choose your campus</h1>
      <p className="muted mt-3 max-w-2xl">
        Each campus runs its own programme mix, faculty and facilities. Your chosen campus follows you through the
        whole application.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {campuses.map((c) => (
          <Link key={c.slug} href={`/campuses/${c.slug}`} className="card card-hover overflow-hidden">
            <div className={`h-32 bg-gradient-to-br ${c.gallery[0].tone}`} />
            <div className="p-6">
              <p className="font-display text-xl text-ink">{c.name}</p>
              <p className="mt-1 text-[13px] text-slate-500">{c.tagline} · est. {c.established}</p>
              <p className="muted mt-3 text-[13px]">{c.address}</p>
              <div className="mt-4 flex gap-4 text-[12px] text-slate-500">
                {c.stats.slice(0, 3).map((s) => (
                  <span key={s.label}><strong className="text-ink">{s.value}</strong> {s.label.toLowerCase()}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
