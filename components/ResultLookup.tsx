"use client";

import { useEffect, useState } from "react";
import { fmtDate } from "@/lib/utils";

const codePool = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const randomCode = () =>
  Array.from({ length: 5 }, () => codePool[Math.floor(Math.random() * codePool.length)]).join("");

export default function ResultLookup() {
  const [roll, setRoll] = useState("");
  const [dob, setDob] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [expected, setExpected] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => setExpected(randomCode()), []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!roll.trim() || !dob) return setError("Enter your roll number and date of birth.");
    if (captcha.trim().toUpperCase() !== expected) {
      setError("The characters you typed do not match the code. Please try again.");
      setExpected(randomCode());
      setCaptcha("");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollNo: roll.trim().toUpperCase(), dob }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.found) {
      setError(data.message || "No result found for those details.");
      setExpected(randomCode());
      setCaptcha("");
      return;
    }
    setResult(data.result);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="card h-fit p-6">
        <p className="font-display text-xl">Result lookup</p>
        <p className="muted mt-1 text-[13px]">Roll number, date of birth and the security code.</p>

        <div className="mt-5">
          <label className="label" htmlFor="roll">Roll number</label>
          <input id="roll" className="input uppercase" placeholder="e.g. CS2201" value={roll} onChange={(e) => setRoll(e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="dob">Date of birth</label>
          <input id="dob" type="date" className="input" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="cap">Security code</label>
          <div className="flex items-center gap-2">
            <input id="cap" className="input uppercase tracking-[0.3em]" placeholder="•••••" maxLength={5} value={captcha} onChange={(e) => setCaptcha(e.target.value)} />
            <button
              type="button"
              onClick={() => setExpected(randomCode())}
              className="select-none rounded-xl border border-dashed border-slate-300 bg-sand px-3 py-2.5 font-display text-lg tracking-[0.35em] text-brand-800"
              style={{ textShadow: "1px 1px 0 #fff, 2px 2px 3px rgba(0,0,0,.18)", fontStyle: "italic" }}
              title="Click for a new code"
            >
              {expected || "·····"}
            </button>
          </div>
        </div>

        {error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] font-medium text-rose-700">{error}</p> : null}

        <button className="btn-primary mt-5 w-full" disabled={loading}>
          {loading ? "Checking…" : "Check result"}
        </button>
        <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">
          Demo credentials: roll <strong>CS2201</strong> with DOB <strong>14/05/2003</strong>, or roll <strong>BCA2304</strong> with DOB <strong>02/09/2004</strong>.
        </p>
      </form>

      <div>
        {result ? (
          <article className="card overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 bg-brand-900 p-6 text-white">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-400">{result.session} · {result.semester}</p>
                <p className="mt-1 font-display text-2xl">{result.name}</p>
                <p className="text-[13px] text-brand-100">{result.program} · {result.campus}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wide text-brand-200">Roll no</p>
                <p className="font-display text-xl">{result.rollNo}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50/70 text-center">
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">SGPA</p>
                <p className="font-display text-2xl text-brand-700">{result.sgpa}</p>
              </div>
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">CGPA</p>
                <p className="font-display text-2xl text-brand-700">{result.cgpa}</p>
              </div>
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Status</p>
                <p className="mt-1 text-[12.5px] font-semibold text-ink">{result.status}</p>
              </div>
            </div>
            <table className="w-full text-left text-[13px]">
              <thead className="bg-white text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Paper</th>
                  <th className="px-3 py-3">Credits</th>
                  <th className="px-3 py-3">Grade</th>
                  <th className="px-5 py-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.papers.map((p: any) => (
                  <tr key={p.code} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3 font-mono text-[12px] text-slate-500">{p.code}</td>
                    <td className="px-5 py-3 font-medium text-ink">{p.title}</td>
                    <td className="px-3 py-3 text-slate-600">{p.credits}</td>
                    <td className="px-3 py-3">
                      <span className="badge-green">{p.grade}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">{p.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-4 text-[12px] text-slate-500">
              <span>Published {fmtDate("2026-11-03")} · Controller of Examinations</span>
              <button onClick={() => window.print()} className="btn-outline btn-sm">Print / save PDF</button>
            </div>
          </article>
        ) : (
          <div className="card grid h-full place-items-center p-10 text-center">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M8 3h8l4 4v14H4V3h4Z" />
                  <path d="M8 12h8M8 16h5" />
                </svg>
              </div>
              <p className="mt-4 font-display text-xl">Your marksheet appears here</p>
              <p className="muted mx-auto mt-2 max-w-sm text-[13px]">
                Results for Semester 4 (B.Tech and BCA) are published. Semester 2 results will be declared on 12 December 2026.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
