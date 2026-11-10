"use client";

import PortalShell, { parentNav } from "@/components/PortalShell";
import { children, parent, ptmSlots } from "@/lib/portals";
import { bookPtm, useStaffStore } from "@/lib/staffStore";
import { fmtDate } from "@/lib/utils";

export default function PtmPage() {
  const store = useStaffStore();
  const child = children.find((c) => c.id === store.child) || children[0];
  const booked = store.ptm;

  return (
    <PortalShell
      title="Parent-teacher meeting"
      subtitle={`Book a 20-minute slot with the class mentor · ${child.name}`}
      groups={parentNav}
      person={{ name: parent.name, sub: "Parent · 2 wards" }}
    >
      {booked ? (
        <div className="card border-brand-300 bg-brand-50/50 p-6">
          <p className="font-display text-xl">Slot booked</p>
          <p className="mt-1 text-[13px] text-slate-600">
            {fmtDate(booked.slot.split(" ")[0])} at {booked.slot.split(" ")[1]} · with Dr. A. Sengupta (class mentor)
          </p>
          <p className="mt-1 text-[11.5px] text-slate-500">A confirmation has been sent to your registered mobile.</p>
          <button onClick={() => bookPtm("", "")} className="btn-outline btn-sm mt-4">Change slot</button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {ptmSlots.map((day) => (
            <div key={day.date} className="card p-5">
              <p className="font-display text-lg">{fmtDate(day.date)}</p>
              <p className="text-[11px] text-slate-500">{day.slots.length} slots · 20 minutes each</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {day.slots.map((s) => {
                  const taken = ["10:40", "14:20"].includes(s);
                  return (
                    <button
                      key={s}
                      disabled={taken}
                      onClick={() => bookPtm(`${day.date} ${s}`, child.id)}
                      className={`rounded-xl border px-2 py-2 text-[12px] font-semibold transition ${
                        taken
                          ? "cursor-not-allowed border-beige bg-slate-50 text-slate-400"
                          : "border-beige bg-ivory/70 text-ink hover:border-brand-500 hover:text-brand-700"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-5 p-5">
        <p className="font-display text-lg">What to expect</p>
        <ul className="mt-2 space-y-1.5 text-[12px] text-slate-600">
          <li>• Attendance and internal marks are shared at the meeting.</li>
          <li>• Bring any medical or leave documents you want recorded.</li>
          <li>• Slots are held for 10 minutes after the start time, then released.</li>
        </ul>
      </div>
    </PortalShell>
  );
}
