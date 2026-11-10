"use client";

import PortalShell, { studentNav } from "@/components/PortalShell";
import { transport } from "@/lib/portal";
import PrintButton from "@/components/PrintButton";

export default function TransportPage() {
  return (
    <PortalShell title="Transport" subtitle={`Route ${transport.route} · ${transport.stop}`} groups={studentNav}>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">Bus {transport.bus}</p>
                <p className="text-[11.5px] text-slate-500">Route {transport.route} · driver {transport.driver}</p>
              </div>
              <span className="badge-green">On time</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["Your stop", transport.stop.split(" (")[0]],
                ["Pickup", transport.pickup],
                ["Drop", transport.drop],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-sand/70 px-2 py-2">
                  <p className="text-[9.5px] uppercase tracking-[0.14em] text-slate-500">{k}</p>
                  <p className="mt-0.5 text-[11.5px] font-semibold text-ink">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Live position</p>
            <div className="relative mt-3 h-40 overflow-hidden rounded-xl border border-beige bg-gradient-to-br from-sand/60 to-ivory">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(90deg,#EAD9C3 1px,transparent 1px),linear-gradient(#EAD9C3 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
              <svg viewBox="0 0 400 140" className="absolute inset-0 h-full w-full">
                <path d="M20 110 C 90 110, 90 40, 170 40 S 280 40, 320 70 L 380 70" fill="none" stroke="#A9002A" strokeWidth="3" strokeDasharray="6 6" opacity="0.5" />
                <circle cx="20" cy="110" r="5" fill="#3B2118" />
                <circle cx="380" cy="70" r="6" fill="#A9002A" />
                <g>
                  <circle cx="170" cy="40" r="9" fill="#C58A00" opacity="0.25" />
                  <circle cx="170" cy="40" r="4.5" fill="#C58A00" />
                </g>
                <text x="8" y="128" fontSize="9" fill="#8B6855">Lake Gardens</text>
                <text x="330" y="60" fontSize="9" fill="#8B6855">Main Campus</text>
              </svg>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Demo map — the bus is between Rabindra Sarobar and Ballygunge Place.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Stops & timings</p>
            <ol className="mt-3 space-y-3">
              {transport.stops.map((s, i) => (
                <li key={s.name} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${s.status === "done" ? "bg-brand-600 text-ivory" : s.status === "next" ? "bg-accent-500 text-ink" : "border border-beige text-slate-400"}`}>
                      {i + 1}
                    </span>
                    {i < transport.stops.length - 1 ? <span className="my-1 w-px flex-1 bg-beige" /> : null}
                  </div>
                  <div className="pb-3">
                    <p className="text-[12.5px] font-medium text-ink">{s.name}</p>
                    <p className="text-[10.5px] text-slate-500">{s.time}{s.status === "next" ? " · approaching" : ""}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Bus pass</p>
            <p className="mt-1 text-[11.5px] text-slate-600">Semester 5 · route {transport.route} · valid till 31/12/2026</p>
            <div className="mt-3 rounded-xl border border-beige bg-ivory/60 p-3">
              <p className="font-mono text-[11px] text-slate-600">BP-2026-R7-0417</p>
              <div className="mt-2 grid grid-cols-10 gap-0.5">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span key={i} className={`h-2.5 ${[0, 2, 3, 5, 7, 8, 11, 12, 14, 16, 18, 20, 21, 24, 26, 28].includes(i) ? "bg-ink" : "bg-transparent"}`} />
                ))}
              </div>
            </div>
            <PrintButton label="Download bus pass" />
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
