"use client";

import PortalShell, { facultyNav } from "@/components/PortalShell";
import { faculty, payslips } from "@/lib/portals";
import PrintButton from "@/components/PrintButton";
import { inr } from "@/lib/utils";

export default function PayslipsPage() {
  return (
    <PortalShell
      title="Payslips"
      subtitle="Monthly salary statements and tax deductions"
      groups={facultyNav}
      person={{ name: faculty.name, sub: `${faculty.code} · Faculty` }}
    >
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-beige px-4 py-3">
            <p className="font-display text-lg">Statements</p>
          </div>
          <table className="w-full text-left text-[12.5px]">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2">Month</th>
                <th className="px-2 py-2">Gross</th>
                <th className="px-2 py-2">Net</th>
                <th className="px-4 py-2 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/60">
              {payslips.map((p) => (
                <tr key={p.month}>
                  <td className="px-4 py-2.5 font-medium text-ink">{p.month}</td>
                  <td className="px-2 py-2.5 text-slate-600">{inr(p.gross)}</td>
                  <td className="px-2 py-2.5 font-semibold">{inr(p.net)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-[11px] font-semibold text-brand-700">PDF</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-5">
          <p className="font-display text-lg">October 2026 statement</p>
          <dl className="mt-3 space-y-1.5 text-[12px]">
            {[
              ["Basic pay", inr(78000)],
              ["Dearness allowance", inr(22000)],
              ["HRA", inr(18000)],
              ["Gross", inr(118000)],
              ["PF (12%)", `- ${inr(9360)}`],
              ["Professional tax", `- ${inr(200)}`],
              ["Income tax (TDS)", `- ${inr(4040)}`],
              ["Net payable", inr(104400)],
            ].map(([k, v], i) => (
              <div key={k} className={`flex justify-between ${i === 3 || i === 7 ? "border-t border-beige pt-1.5 font-semibold text-ink" : "text-slate-600"}`}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <PrintButton label="Download payslip" />
        </div>
      </div>
    </PortalShell>
  );
}
