"use client";

import PortalShell, { academicsNav } from "@/components/PortalShell";
import { department, marksApprovals } from "@/lib/portals";
import { setApproval, useStaffStore } from "@/lib/staffStore";
import { fmtDate } from "@/lib/utils";

export default function ApprovalsPage() {
  const store = useStaffStore();

  return (
    <PortalShell
      title="Marks approval"
      subtitle="Review internal marks grids submitted by faculty"
      groups={academicsNav}
      person={{ name: department.hod, sub: "HOD · Computer Science" }}
    >
      <div className="card overflow-hidden">
        <div className="border-b border-beige px-4 py-3">
          <p className="font-display text-lg">Submitted grids</p>
        </div>
        <table className="w-full text-left text-[12.5px]">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Subject</th>
              <th className="px-2 py-2">Faculty</th>
              <th className="px-2 py-2">Submitted</th>
              <th className="px-2 py-2">Entries</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/60">
            {marksApprovals.map((m) => {
              const status = store.approvals[m.code] || m.status;
              return (
                <tr key={m.code}>
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-ink">{m.subject}</p>
                    <p className="text-[10px] text-slate-500">{m.code}</p>
                  </td>
                  <td className="px-2 py-2.5 text-slate-600">{m.faculty}</td>
                  <td className="px-2 py-2.5 text-slate-600">{fmtDate(m.submitted)}</td>
                  <td className="px-2 py-2.5 text-slate-600">{m.entries}</td>
                  <td className="px-2 py-2.5">
                    <span className={status === "Approved" ? "badge-green" : status === "Returned" ? "badge-red" : "badge-amber"}>{status}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => setApproval(m.code, "Approved")} className="rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-semibold text-ivory hover:bg-brand-700">
                        Approve
                      </button>
                      <button onClick={() => setApproval(m.code, "Returned")} className="rounded-full border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50">
                        Return
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="border-t border-beige px-4 py-3 text-[11px] text-slate-500">
          Approved grids are locked for faculty edits and flow into the result computation.
        </p>
      </div>
    </PortalShell>
  );
}
