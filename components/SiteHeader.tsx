import Link from "next/link";
import { BRAND } from "@/lib/data";
import type { Tenant } from "@/lib/tenant";
import CampusSwitcher from "./CampusSwitcher";

const nav = [
  { href: "/programs", label: "Programs" },
  { href: "/campuses/main", label: "Campuses" },
  { href: "/notices", label: "Notices" },
  { href: "/events", label: "Events" },
  { href: "/results/lookup", label: "Results" },
  { href: "/verify", label: "Verify" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader({ tenant }: { tenant: Tenant }) {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="mx-auto w-full max-w-shell">
        <div className="glass-nav flex h-[62px] items-center justify-between gap-3 rounded-2xl px-3 sm:px-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-ivory shadow-[0_10px_22px_-12px_rgba(169,0,42,.9)] ring-1 ring-accent-500/40 transition duration-300 group-hover:ring-accent-500/80">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 9.5 12 4l9 5.5" />
                <path d="M5 11v8h14v-8" />
                <path d="M9.5 19v-5h5v5" />
              </svg>
            </span>
            <span className="leading-none">
              <span className="block font-display text-[19px] font-semibold tracking-tight text-ink">{BRAND.name}</span>
              <span className="mt-0.5 block text-[9.5px] font-bold uppercase tracking-[0.24em] text-accent-600">
                {BRAND.latin}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-[13px] font-medium text-slate-600 transition duration-300 ease-lux hover:bg-ivory/80 hover:text-brand-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <CampusSwitcher current={tenant.slug} />
            </div>
            <Link
              href="/student"
              className="hidden rounded-full px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:text-brand-700 md:block"
            >
              Student
            </Link>
            <Link
              href="/login"
              className="hidden rounded-full px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:text-brand-700 sm:block"
            >
              Sign in
            </Link>
            <Link href="/apply" className="btn-primary btn-sm">
              Apply now
            </Link>
            <details className="relative lg:hidden">
              <summary className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-beige bg-ivory/70 text-ink marker:content-none backdrop-blur">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </summary>
              <div className="glass absolute right-0 mt-2 w-60 rounded-2xl p-2 shadow-lift">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-1 border-t border-beige pt-2 sm:hidden">
                  <CampusSwitcher current={tenant.slug} />
                </div>
                <Link href="/student" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50">
                  Student dashboard
                </Link>
                <Link href="/admin" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50">
                  Admin panel
                </Link>
              </div>
            </details>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-2 pt-2 text-[10.5px] uppercase tracking-[0.14em] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-500" />
            Viewing <strong className="font-semibold text-ink">{tenant.shortName}</strong>
            <span className="hidden normal-case tracking-normal text-slate-400 sm:inline">
              · resolved from {tenant.resolvedFrom} ({tenant.host})
            </span>
          </span>
          <span className="hidden normal-case tracking-normal sm:inline">
            {BRAND.session} · Helpline {BRAND.phone}
          </span>
        </div>
      </div>
    </header>
  );
}
