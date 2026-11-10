import Link from "next/link";
import NoticeTicker from "@/components/NoticeTicker";
import ProgramCard from "@/components/ProgramCard";
import SectionHead from "@/components/SectionHead";
import { BRAND, campuses, events, notices, programs } from "@/lib/data";
import { currentTenant } from "@/lib/tenant";
import { fmtDate, inrShort } from "@/lib/utils";

const highlights = [
  { value: "44", label: "Programmes", note: "UG, PG and diploma across 4 campuses" },
  { value: "8,430", label: "Students", note: "One of the largest cohorts in the region" },
  { value: "92%", label: "Placement", note: "2025 graduating cohort, all campuses" },
  { value: "₹4.1 cr", label: "Scholarships", note: "Awarded last academic year" },
];

const journey = [
  { step: "01", title: "Create your account", body: "Verify your email or mobile with a one-time password — takes 30 seconds." },
  { step: "02", title: "Fill the 7-step form", body: "Programme preferences, personal details, academics and documents. Saved automatically." },
  { step: "03", title: "Pay ₹750 and submit", body: "Demo payment gateway, instant receipt PDF you can download." },
  { step: "04", title: "Track to enrolment", body: "Verification, entrance test, merit list, offer letter and admission fee — all on one timeline." },
];

export default function HomePage() {
  const tenant = currentTenant();
  const featured = programs.filter((p) => ["btech-cse", "bba", "bca", "mba"].includes(p.slug));
  const upcoming = events.slice(0, 3);
  const latestNotices = notices.slice(0, 4);
  const campus = campuses.find((c) => c.slug === tenant.slug) || campuses[0];

  return (
    <>
      {/* HERO */}
      <section className="hero-glow relative overflow-hidden">
        <div className="absolute inset-0 grain opacity-40" aria-hidden />
        <div className="shell relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-600/20 bg-white/70 px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-brand-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
              </span>
              Admissions open · {BRAND.session}
            </div>
            <h1 className="h1 mt-5 text-ink">
              Admissions, results and
              <span className="relative mx-2 inline-block">
                <span className="relative z-10 italic text-brand-700">student life</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 rounded bg-accent-100" aria-hidden />
              </span>
              in one place.
            </h1>
            <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-slate-600">
              {BRAND.promise} Apply in seven guided steps, download your hall ticket, verify a certificate —
              everything runs on the campus you pick, <span className="font-semibold text-ink">{campus.shortName}</span>.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/apply" className="btn-primary">
                Start your application
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link href="/programs" className="btn-outline">Browse 44 programmes</Link>
              <Link href="/student" className="btn-ghost hidden sm:inline-flex">Student login</Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {highlights.map((h) => (
                <div key={h.label}>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{h.label}</dt>
                  <dd className="font-display text-2xl text-ink">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Admission status card mockup */}
          <div className="relative">
            <div className="absolute -left-8 -top-10 h-40 w-40 rounded-full bg-accent-400/25 blur-3xl" aria-hidden />
            <div className="absolute -bottom-12 right-0 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" aria-hidden />
            <div className="relative rounded-[26px] border border-white/70 bg-white/85 p-5 shadow-lift backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Application tracker</p>
                  <p className="mt-1 font-display text-lg text-ink">CS-APP-1042 · Ananya D.</p>
                </div>
                <span className="badge-green">Verified</span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  { label: "Application submitted", at: "05 Nov", done: true },
                  { label: "Documents verified", at: "06 Nov", done: true },
                  { label: "Entrance test · CSAT", at: "24 Nov", done: false },
                  { label: "Merit list", at: "28 Dec", done: false },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${row.done ? "bg-brand-600 text-white" : "border border-dashed border-slate-300 text-slate-400"}`}>
                      {row.done ? "✓" : ""}
                    </span>
                    <p className={`flex-1 text-[13px] ${row.done ? "font-semibold text-ink" : "text-slate-500"}`}>{row.label}</p>
                    <span className="text-[11.5px] text-slate-400">{row.at}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-sand p-4">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-ink">Application fee</span>
                  <span className="text-slate-500">₹750 paid · UPI</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                  <div className="h-full w-1/2 rounded-full bg-brand-600" />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">Hall ticket available for download</p>
              </div>
              <Link href="/apply/CS-APP-1042/status" className="btn-outline btn-sm mt-4 w-full">
                Open this demo application
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <section className="shell -mt-6">
        <NoticeTicker />
      </section>

      {/* CAMPUSES */}
      <section className="shell py-16">
        <SectionHead
          eyebrow="Four campuses, one college"
          title="Pick the campus that fits your week"
          body="Each campus runs its own programs, faculty and facilities. Switch campus from the header — the whole site follows, including fees and seats."
          action={<Link href="/campuses/main" className="btn-outline btn-sm">Campus details</Link>}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {campuses.map((c) => (
            <Link
              key={c.slug}
              href={`/campuses/${c.slug}`}
              className="group relative overflow-hidden rounded-xl2 border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div className={`mb-4 h-24 rounded-xl bg-gradient-to-br ${c.gallery[0].tone}`}>
                <div className="flex h-full items-end justify-between p-3 text-white">
                  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-90">Est. {c.established}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-90">{c.city}</span>
                </div>
              </div>
              <p className="font-display text-lg leading-snug text-ink group-hover:text-brand-700">{c.shortName}</p>
              <p className="mt-1 text-[12.5px] text-slate-500">{c.tagline}</p>
              <div className="mt-3 flex gap-3 text-[11.5px] text-slate-500">
                <span><strong className="text-ink">{c.stats[0].value}</strong> programmes</span>
                <span><strong className="text-ink">{c.stats[1].value}</strong> students</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="shell">
          <SectionHead
            eyebrow="Popular this session"
            title="Programmes students ask for most"
            body="Every programme page carries the full syllabus, eligibility, fee break-up, seat matrix and FAQs."
            action={<Link href="/programs" className="btn-outline btn-sm">All programmes</Link>}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProgramCard key={p.slug} program={p} />
            ))}
          </div>
          <div className="mt-6 grid gap-3 rounded-xl2 border border-dashed border-slate-300 bg-slate-50/60 p-5 sm:grid-cols-3">
            {[
              { k: "Lowest tuition", v: inrShort(48000), n: "Diploma programmes, Polytechnic" },
              { k: "Highest placement", v: "96%", n: "B.Tech CSE, Main Campus" },
              { k: "Hybrid options", v: "5", n: "BCA and MBA run weekend-friendly" },
            ].map((x) => (
              <div key={x.k}>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{x.k}</p>
                <p className="font-display text-2xl text-ink">{x.v}</p>
                <p className="text-[12px] text-slate-500">{x.n}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="shell py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Admission portal</p>
            <h2 className="h2 mt-2">From first click to enrolled — seven steps, no queue</h2>
            <p className="muted mt-3">
              The wizard saves every field as you type, so you can stop halfway and come back on your phone.
              Uploads are checked for type and size before they are accepted.
            </p>
            <div className="mt-6 space-y-3">
              {journey.map((j) => (
                <div key={j.step} className="flex gap-4 rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
                  <span className="font-display text-xl text-brand-600">{j.step}</span>
                  <div>
                    <p className="font-semibold text-ink">{j.title}</p>
                    <p className="text-[13px] text-slate-600">{j.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/apply" className="btn-primary mt-6">Open the admission portal</Link>
          </div>

          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg">Latest notices</p>
                <Link href="/notices" className="text-[12.5px] font-semibold text-brand-700 hover:underline">View all</Link>
              </div>
              <ul className="mt-3 divide-y divide-slate-100">
                {latestNotices.map((n) => (
                  <li key={n.id} className="flex items-start gap-3 py-3">
                    <span className="mt-0.5 w-14 shrink-0 text-[11.5px] font-semibold text-slate-400">{fmtDate(n.date)}</span>
                    <div>
                      <Link href="/notices" className="text-[13.5px] font-medium leading-snug text-ink hover:text-brand-700">{n.title}</Link>
                      <p className="mt-0.5 text-[11.5px] text-slate-400">{n.category}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg">Coming up on campus</p>
                <Link href="/events" className="text-[12.5px] font-semibold text-brand-700 hover:underline">Calendar</Link>
              </div>
              <ul className="mt-3 space-y-3">
                {upcoming.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 rounded-xl bg-sand/70 p-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-center">
                      <span className="font-display text-base leading-none text-brand-700">{new Date(e.date).getDate()}</span>
                      <span className="text-[9px] font-bold uppercase text-slate-400">{new Date(e.date).toLocaleString("en-IN", { month: "short" })}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-ink">{e.title}</p>
                      <p className="truncate text-[11.5px] text-slate-500">{e.time} · {e.venue}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SELF SERVICE */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="shell">
          <SectionHead
            eyebrow="Self service"
            title="Things you can do without a phone call"
            align="center"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/results/lookup", title: "Check your result", body: "Roll number, date of birth and a security code.", icon: "M8 3h8l4 4v14H4V3h4Z" },
              { href: "/verify", title: "Verify a certificate", body: "Employers confirm a degree in seconds via QR ID.", icon: "m4 12 5 5L20 6" },
              { href: "/apply/CS-APP-1078/status", title: "Download hall ticket", body: "Open a demo application to see the tracker.", icon: "M4 5h16v14H4zM8 9h8" },
              { href: "/admin", title: "Staff console", body: "Verification queue, merit list and enquiries.", icon: "M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5" },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="card card-hover group p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d={c.icon} /></svg>
                </span>
                <p className="mt-4 font-semibold text-ink group-hover:text-brand-700">{c.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{c.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="shell py-16">
        <div className="relative overflow-hidden rounded-[28px] bg-brand-900 px-8 py-12 text-white sm:px-12">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-500/30 blur-3xl" aria-hidden />
          <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-brand-500/40 blur-3xl" aria-hidden />
          <div className="relative grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-400">Autumn 2026 · closes 20 December</p>
              <h2 className="h2 mt-3 text-white">Your application takes about twelve minutes</h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-brand-100">
                Keep your mark sheets, ID proof and a photograph handy. Everything else — reminders, hall ticket,
                merit list, offer letter — lands on your tracker.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/apply" className="btn-accent w-full">Apply now</Link>
              <Link href="/contact" className="btn w-full border border-white/25 text-white hover:bg-white/10">Talk to a counsellor</Link>
              <p className="text-center text-[11.5px] text-brand-200">Helpline {BRAND.phone} · 9 AM – 7 PM</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
