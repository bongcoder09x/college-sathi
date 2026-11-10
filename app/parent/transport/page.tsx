"use client";

import PortalShell, { parentNav } from "@/components/PortalShell";
import { children, parent } from "@/lib/portals";
import { transport } from "@/lib/portal";
import { useStaffStore } from "@/lib/staffStore";

export default function ParentTransportPage() {
  const store = useStaffStore();
  const child = children.find((c) => c.id === store.child) || children[0];

  return (
    <PortalShell
      title="Live bus tracking"
      subtitle={`${child.name} · route ${transport.route} · ${child.busStop}`}
      groups={parentNav}
      person={{ name: parent.name, sub: "Parent · 2 wards" }}
    >
      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">Arriving in {child.busEta}</p>
                <p className="text-[11.5px] text-slate-500">Bus {transport.bus} · driver {transport.driver}</p>
              </div>
              <span className="badge-green">Moving</span>
            </div>
            <div className="relative mt-4 h-44 overflow-hidden rounded-xl border border-beige bg-gradient-to-br from-sand/60 to-ivory">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(90deg,#EAD9C3 1px,transparent 1px),linear-gradient(#EAD9C3 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
              <svg viewBox="0 0 400 150" className="absolute inset-0 h-full w-full">
                <path id="route" d="M20 120 C 90 120, 90 45, 175 45 S 285 45, 330 80 L 380 80" fill="none" stroke="#A9002A" strokeWidth="3" strokeDasharray="6 6" opacity="0.45" />
                <circle cx="20" cy="120" r="5" fill="#3B2118" />
                <circle cx="380" cy="80" r="6" fill="#A9002A" />
                <circle cx="175" cy="45" r="4" fill="#C58A00" />
                <circle r="7" fill="#C58A00">
                  <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#route" />
                  </animateMotion>
                </circle>
                <text x="6" y="138" fontSize="9" fill="#8B6855">Lake Gardens</text>
                <text x="318" y="70" fontSize="9" fill="#8B6855">Main Campus</text>
              </svg>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Demo map · position updates every few seconds in the real app via the transport service.</p>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Stop timeline</p>
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
                    <p className="text-[10.5px] text-slate-500">{s.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Notifications</p>
            <ul className="mt-2 space-y-2 text-[11.5px] text-slate-600">
              <li className="rounded-xl bg-ivory/60 p-2.5">Bus crossed Rabindra Sarobar at 8:50 AM.</li>
              <li className="rounded-xl bg-ivory/60 p-2.5">Pickup confirmed by the driver.</li>
            </ul>
            <p className="mt-3 text-[10.5px] text-slate-500">SMS alerts are sent to the registered guardian number.</p>
          </div>
          <div className="card p-5">
            <p className="font-display text-lg">Transport pass</p>
            <p className="mt-1 text-[11.5px] text-slate-600">Route {transport.route} · valid till 31/12/2026</p>
            <p className="mt-2 font-mono text-[11px] text-ink">BP-2026-R7-0417</p>
            <button className="btn-outline btn-sm mt-3 w-full">Download pass</button>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
