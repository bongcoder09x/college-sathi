import type { Metadata } from "next";
import Link from "next/link";
import { notices, publishedResults } from "@/lib/data";
import { studentProfile } from "@/lib/student";
import { fmtDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Student dashboard" };

const timetable = [
  { time: "9:00 – 10:00", mon: "Machine Learning", tue: "Compiler Design", wed: "Information Security", thu: "Machine Learning", fri: "Elective: NLP" },
  { time: "10:15 – 11:15", mon: "Compiler Design", tue: "Machine Learning", wed: "Capstone studio", thu: "Compiler Design", fri: "Information Security" },
  { time: "11:30 – 12:30", mon: "Information Security", tue: "Capstone studio", wed: "Machine Learning", thu: "Elective: NLP", fri: "Capstone studio" },
  { time: "2:00 – 4:00", mon: "Lab: Networks", tue: "Lab: ML", wed: "Library / mentor", thu: "Lab: Security", fri: "Sports" },
];

const fees = [
  { head: "Semester 5 tuition", amount: 64000, status: "Paid", date: "2026-07-12" },
  { head: "Hostel (Block B)", amount: 38000, status: "Paid", date: "2026-07-18" },
  { head: "Examination fee", amount: 2400, status: "Due 25/11/2026", date: "" },
];

export default function StudentPage() {
  const result = publishedResults["CS2201"];
  return (
    <div className="shell py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Student dashboard · demo</p>
          <h1 className="h2 mt-1">Hello, {studentProfile.name.split(" ")[0]}</h1>
          <p className="muted mt-1 text-[13px]">
            {studentProfile.rollNo} · {studentProfile.program} · {studentProfile.campus} · {studentProfile.semester}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/results/lookup" className="btn-outline btn-sm">Result lookup</Link>
          <Link href="/apply/CS-APP-1042/status" className="btn-ghost btn-sm">Admission tracker</Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "CGPA", value: studentProfile.cgpa, note: "out of 10 · semester 5" },
          { label: "Attendance", value: `${studentProfile.attendance}%`, note: "minimum required 75%" },
          { label: "Credits earned", value: String(studentProfile.creditsEarned), note: "of 160 for the degree" },
          { label: "Fees due", value: "₹2,400", note: "examination fee, due 25 Nov" },
        ].map((k) => (
          <div key={k.label} className="kpi">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">{k.label}</p>
            <p className="mt-1 font-display text-2xl text-ink">{k.value}</p>
            <p className="mt-0.5 text-[11.5px] text-slate-500">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="font-display text-lg">This week's timetable</p>
              <span className="text-[11.5px] text-slate-500">Semester 5 · Section A</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[12px]">
                <thead className="bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5">Time</th>
                    <th className="px-3 py-2.5">Mon</th>
                    <th className="px-3 py-2.5">Tue</th>
                    <th className="px-3 py-2.5">Wed</th>
                    <th className="px-3 py-2.5">Thu</th>
                    <th className="px-3 py-2.5">Fri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timetable.map((row) => (
                    <tr key={row.time}>
                      <td className="px-4 py-2.5 font-medium text-slate-500">{row.time}</td>
                      <td className="px-3 py-2.5">{row.mon}</td>
                      <td className="px-3 py-2.5">{row.tue}</td>
                      <td className="px-3 py-2.5">{row.wed}</td>
                      <td className="px-3 py-2.5">{row.thu}</td>
                      <td className="px-3 py-2.5">{row.fri}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Latest result · {result.semester}</p>
              <span className="badge-green">SGPA {result.sgpa}</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {result.papers.map((p: any) => (
                <div key={p.code} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <div>
                    <p className="text-[12px] font-semibold text-ink">{p.title}</p>
                    <p className="text-[10.5px] text-slate-500">{p.code} · {p.credits} credits</p>
                  </div>
                  <span className="badge-green">{p.grade}</span>
                </div>
              ))}
            </div>
            <Link href="/results/lookup" className="btn-outline btn-sm mt-4">Open marksheet</Link>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4">
              <p className="font-display text-lg">Fees & payments</p>
            </div>
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-2.5">Head</th>
                  <th className="px-3 py-2.5">Amount</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-5 py-2.5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map((f) => (
                  <tr key={f.head}>
                    <td className="px-5 py-2.5 font-medium text-ink">{f.head}</td>
                    <td className="px-3 py-2.5">₹{f.amount.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2.5">
                      <span className={f.status === "Paid" ? "badge-green" : "badge-amber"}>{f.status}</span>
                    </td>
                    <td className="px-5 py-2.5 text-right text-slate-500">{f.date ? fmtDate(f.date) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <p className="font-display text-lg">Quick actions</p>
            <div className="mt-3 space-y-2">
              {[
                { label: "Download hall ticket", href: "/apply/CS-APP-1042/hall-ticket" },
                { label: "Fee receipt", href: "/apply/CS-APP-1042/receipt" },
                { label: "Certificate verification", href: "/verify" },
                { label: "Ask the mentor", href: "/contact" },
              ].map((x) => (
                <Link key={x.label} href={x.href} className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5 text-[12.5px] font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700">
                  {x.label}
                  <span>→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Notices for you</p>
            <ul className="mt-3 space-y-2.5">
              {notices.slice(0, 4).map((n) => (
                <li key={n.id}>
                  <Link href="/notices" className="text-[12.5px] font-medium leading-snug text-slate-700 hover:text-brand-700">
                    {n.title}
                  </Link>
                  <p className="text-[10.5px] text-slate-400">{fmtDate(n.date)} · {n.category}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="card bg-sand p-5">
            <p className="text-[12.5px] font-semibold text-ink">Mentor</p>
            <p className="mt-1 text-[12px] text-slate-600">{studentProfile.mentor}</p>
            <p className="text-[11.5px] text-slate-500">Office hours: Tue & Thu, 2–4 PM</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
