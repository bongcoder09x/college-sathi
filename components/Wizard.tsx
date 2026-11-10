"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { campuses, programs } from "@/lib/data";
import type { Application, DocumentItem } from "@/lib/types";
import { inr } from "@/lib/utils";
import FileDrop from "./FileDrop";

const STEPS = [
  { n: 1, title: "Programme & campus", hint: "Up to three preferences" },
  { n: 2, title: "Personal details", hint: "As printed on your ID" },
  { n: 3, title: "Guardian details", hint: "Parent or guardian" },
  { n: 4, title: "Academic history", hint: "Board, marks, year" },
  { n: 5, title: "Documents", hint: "Checklist & uploads" },
  { n: 6, title: "Review & declare", hint: "Check everything" },
  { n: 7, title: "Application fee", hint: "Pay and submit" },
];

const REQUIRED_DOCS = [
  { kind: "Photograph", hint: "JPG or PNG · under 2 MB", required: true },
  { kind: "Class 10 marksheet", hint: "PDF · under 2 MB", required: true },
  { kind: "Class 12 marksheet", hint: "PDF · under 2 MB", required: true },
  { kind: "Aadhaar / ID proof", hint: "PDF · masked number is fine", required: true },
  { kind: "Caste certificate", hint: "Only if applying under a reserved category", required: false },
  { kind: "Income certificate", hint: "For scholarship evaluation", required: false },
];

export default function Wizard({ initial }: { initial: Application }) {
  const [app, setApp] = useState<Application>(initial);
  const [step, setStep] = useState(initial.step > 7 ? 7 : initial.step);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [savedAt, setSavedAt] = useState(initial.updatedAt);
  const [errors, setErrors] = useState<string[]>([]);
  const [paying, setPaying] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setState("saving");
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step,
          preferences: app.preferences,
          personal: app.personal,
          guardian: app.guardian,
          academics: app.academics,
          documents: app.documents,
          declaration: app.declaration,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setState("saved");
        setSavedAt(data.savedAt);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [app, step]);

  const setPersonal = (k: string, v: string) => setApp({ ...app, personal: { ...app.personal, [k]: v } });
  const setGuardian = (k: string, v: string) => setApp({ ...app, guardian: { ...app.guardian, [k]: v } });
  const setPreference = (i: number, key: "programSlug" | "campusSlug", v: string) => {
    const preferences = app.preferences.map((p, idx) => (idx === i ? { ...p, [key]: v } : p));
    setApp({ ...app, preferences });
  };
  const setAcademic = (i: number, k: string, v: string) => {
    const academics = app.academics.map((a, idx) => (idx === i ? { ...a, [k]: v } : a));
    setApp({ ...app, academics });
  };
  const addAcademic = () =>
    setApp({
      ...app,
      academics: [
        ...app.academics,
        { level: "Graduation", board: "", school: "", yearOfPassing: "", marksObtained: "", maxMarks: "", percentage: "" },
      ],
    });

  const validate = (n: number) => {
    const e: string[] = [];
    if (n === 1) {
      if (!app.preferences[0].programSlug) e.push("Choose at least one programme preference.");
      if (!app.preferences[0].campusSlug) e.push("Choose a campus for your first preference.");
      const filled = app.preferences.filter((p) => p.programSlug && p.campusSlug);
      const dupes = new Set(filled.map((p) => p.programSlug + p.campusSlug));
      if (dupes.size !== filled.length) e.push("Two preferences are identical — pick different programmes or campuses.");
    }
    if (n === 2) {
      const p = app.personal;
      if (!p.fullName.trim()) e.push("Full name is required.");
      if (!p.dob) e.push("Date of birth is required.");
      if (!p.gender) e.push("Select a gender.");
      if (!p.category) e.push("Select a category.");
      if (!p.idNumber.trim()) e.push("ID number is required.");
      if (!p.address.trim() || !p.city.trim() || !p.pin.trim()) e.push("Complete the address, city and PIN.");
    }
    if (n === 3) {
      const g = app.guardian;
      if (!g.name.trim()) e.push("Guardian name is required.");
      if (!g.relation) e.push("Select the relation.");
      if (!/^\d{10}$/.test(g.phone)) e.push("Guardian mobile must be a 10-digit number.");
    }
    if (n === 4) {
      app.academics.forEach((a, i) => {
        if (!a.board.trim()) e.push(`Row ${i + 1}: board or university is required.`);
        if (!a.yearOfPassing) e.push(`Row ${i + 1}: year of passing is required.`);
        if (!a.marksObtained || !a.maxMarks) e.push(`Row ${i + 1}: enter marks obtained and maximum marks.`);
      });
    }
    if (n === 5) {
      const have = app.documents.map((d) => d.kind);
      REQUIRED_DOCS.filter((d) => d.required).forEach((d) => {
        if (!have.includes(d.kind)) e.push(`${d.kind} has not been uploaded.`);
      });
    }
    if (n === 6) {
      if (!app.declaration) e.push("Tick the declaration before continuing.");
    }
    return e;
  };

  const go = (target: number) => {
    if (target > step) {
      const e = validate(step);
      if (e.length) {
        setErrors(e);
        return;
      }
    }
    setErrors([]);
    setStep(Math.min(7, Math.max(1, target)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pay = async () => {
    setPaying(true);
    const res = await fetch(`/api/applications/${app.id}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "application", mode: "UPI (demo)" }),
    });
    const data = await res.json();
    setPaying(false);
    if (data.ok) setApp(data.application);
  };

  const firstProgram = programs.find((p) => p.slug === app.preferences[0]?.programSlug);
  const feeAmount = firstProgram?.level === "PG" ? 1200 : 750;
  const completion = Math.round(((step - 1) / 7) * 100);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* progress rail */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg">Your application</p>
            <span className="text-[11px] font-semibold text-slate-400">{app.id}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${completion}%` }} />
          </div>
          <p className="mt-2 text-[11.5px] text-slate-500">
            {state === "saving" ? "Saving…" : state === "saved" ? `Saved ${new Date(savedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Autosave on"}
          </p>

          <ol className="mt-4 space-y-1">
            {STEPS.map((s) => {
              const done = s.n < step;
              const active = s.n === step;
              return (
                <li key={s.n}>
                  <button
                    onClick={() => go(s.n)}
                    className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                      active ? "bg-brand-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10.5px] font-bold ${
                        done ? "bg-brand-600 text-white" : active ? "bg-brand-600 text-white" : "border border-slate-300 text-slate-400"
                      }`}
                    >
                      {done ? "✓" : s.n}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-[12.5px] font-semibold ${active || done ? "text-ink" : "text-slate-500"}`}>{s.title}</span>
                      <span className="block text-[10.5px] text-slate-400">{s.hint}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <Link href={`/apply/${app.id}/status`} className="btn-outline btn-sm mt-3 w-full">
          View status tracker
        </Link>
      </aside>

      {/* step body */}
      <div>
        <div className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Step {step} of 7</p>
              <h2 className="h3 mt-1">{STEPS[step - 1].title}</h2>
            </div>
            <span className="badge-slate">{app.status}</span>
          </div>

          {errors.length ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
              <p className="text-[12.5px] font-semibold text-rose-800">Please fix these before continuing:</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-[12px] text-rose-700">
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-6">
            {step === 1 && (
              <div className="space-y-4">
                <p className="muted text-[13px]">
                  Pick up to three programme-and-campus combinations. You will be offered the highest preference you
                  qualify for.
                </p>
                {app.preferences.map((pref, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[12.5px] font-bold uppercase tracking-wide text-slate-500">Preference {i + 1}</p>
                      {i > 0 && !pref.programSlug ? <span className="text-[11px] text-slate-400">Optional</span> : null}
                    </div>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="label">Programme</label>
                        <select className="input" value={pref.programSlug} onChange={(e) => setPreference(i, "programSlug", e.target.value)}>
                          <option value="">Select a programme</option>
                          {programs.map((p) => (
                            <option key={p.slug} value={p.slug}>
                              {p.name} ({p.level})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label">Campus</label>
                        <select className="input" value={pref.campusSlug} onChange={(e) => setPreference(i, "campusSlug", e.target.value)}>
                          <option value="">Select a campus</option>
                          {campuses
                            .filter((c) => !pref.programSlug || programs.find((p) => p.slug === pref.programSlug)?.campuses.includes(c.slug))
                            .map((c) => (
                              <option key={c.slug} value={c.slug}>{c.shortName} · {c.city}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                {firstProgram ? (
                  <div className="rounded-xl bg-sand p-4 text-[12.5px] text-slate-700">
                    <strong className="text-ink">{firstProgram.shortName}</strong> · {firstProgram.duration} ·{" "}
                    {inr(firstProgram.feesPerYear)} per year · {firstProgram.seats} seats · eligibility: {firstProgram.eligibility}
                  </div>
                ) : null}
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name (as on ID)" required value={app.personal.fullName} onChange={(v) => setPersonal("fullName", v)} />
                <Field label="Date of birth" required type="date" value={app.personal.dob} onChange={(v) => setPersonal("dob", v)} />
                <Select label="Gender" required value={app.personal.gender} onChange={(v) => setPersonal("gender", v)} options={["Female", "Male", "Transgender", "Prefer not to say"]} />
                <Select label="Category" required value={app.personal.category} onChange={(v) => setPersonal("category", v)} options={["General", "OBC-A", "OBC-B", "SC", "ST", "EWS"]} />
                <Select label="ID type" value={app.personal.idType} onChange={(v) => setPersonal("idType", v)} options={["Aadhaar", "Passport", "Voter ID", "Driving licence"]} />
                <Field label="ID number" required value={app.personal.idNumber} onChange={(v) => setPersonal("idNumber", v)} placeholder="Last 4 digits visible is fine" />
                <div className="sm:col-span-2">
                  <Field label="Address" required value={app.personal.address} onChange={(v) => setPersonal("address", v)} placeholder="House, street, area" />
                </div>
                <Field label="City / town" required value={app.personal.city} onChange={(v) => setPersonal("city", v)} />
                <Field label="PIN code" required value={app.personal.pin} onChange={(v) => setPersonal("pin", v)} />
                <Select label="State" value={app.personal.state} onChange={(v) => setPersonal("state", v)} options={["West Bengal", "Bihar", "Jharkhand", "Odisha", "Assam", "Tripura", "Other"]} />
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Guardian name" required value={app.guardian.name} onChange={(v) => setGuardian("name", v)} />
                <Select label="Relation" required value={app.guardian.relation} onChange={(v) => setGuardian("relation", v)} options={["Father", "Mother", "Legal guardian", "Other"]} />
                <Field label="Mobile number" required value={app.guardian.phone} onChange={(v) => setGuardian("phone", v)} placeholder="10-digit number" />
                <Field label="Email" value={app.guardian.email} onChange={(v) => setGuardian("email", v)} />
                <Select label="Occupation" value={app.guardian.occupation} onChange={(v) => setGuardian("occupation", v)} options={["Service", "Business", "Teacher", "Farmer", "Retired", "Homemaker", "Other"]} />
                <Select label="Annual household income" value={app.guardian.annualIncome} onChange={(v) => setGuardian("annualIncome", v)} options={["Below 1 lakh", "1-3 lakh", "3-6 lakh", "6-10 lakh", "10-15 lakh", "Above 15 lakh"]} />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                {app.academics.map((a, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[12.5px] font-bold uppercase tracking-wide text-slate-500">{a.level}</p>
                      {i >= 2 ? (
                        <button
                          onClick={() => setApp({ ...app, academics: app.academics.filter((_, idx) => idx !== i) })}
                          className="text-[11.5px] font-semibold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      <Field label="Board / university" required value={a.board} onChange={(v) => setAcademic(i, "board", v)} placeholder="WBBSE, CBSE, WBCHSE…" />
                      <Field label="School / college" value={a.school} onChange={(v) => setAcademic(i, "school", v)} />
                      <Field label="Year of passing" required value={a.yearOfPassing} onChange={(v) => setAcademic(i, "yearOfPassing", v)} placeholder="2025" />
                      <div className="grid grid-cols-3 gap-2">
                        <Field label="Marks" required value={a.marksObtained} onChange={(v) => setAcademic(i, "marksObtained", v)} />
                        <Field label="Out of" required value={a.maxMarks} onChange={(v) => setAcademic(i, "maxMarks", v)} />
                        <Field
                          label="%"
                          value={a.marksObtained && a.maxMarks ? ((Number(a.marksObtained) / Number(a.maxMarks)) * 100).toFixed(1) : ""}
                          onChange={(v) => setAcademic(i, "percentage", v)}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addAcademic} className="btn-outline btn-sm">+ Add another qualification</button>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <p className="muted text-[13px]">
                  PDF, JPG or PNG up to 2 MB each. Drag a file in, or click to browse. Files are validated in the browser
                  and again on the server.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {REQUIRED_DOCS.map((d) => {
                    const current = app.documents.find((x) => x.kind === d.kind);
                    return (
                      <div key={d.kind} className="rounded-xl border border-slate-200 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-[12.5px] font-semibold text-ink">
                            {d.kind}
                            {d.required ? <span className="text-rose-500"> *</span> : null}
                          </p>
                          {current ? <span className="badge-green">Uploaded</span> : null}
                        </div>
                        <FileDrop
                          kind={d.kind}
                          hint={d.hint}
                          required={d.required}
                          current={current}
                          onUploaded={(doc: DocumentItem) =>
                            setApp({ ...app, documents: [...app.documents.filter((x) => x.kind !== doc.kind), doc] })
                          }
                          onRemove={() => setApp({ ...app, documents: app.documents.filter((x) => x.kind !== d.kind) })}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <Review title="Preferences" onEdit={() => setStep(1)}>
                  <ul className="space-y-1">
                    {app.preferences.filter((p) => p.programSlug).map((p, i) => (
                      <li key={i} className="text-[13px] text-slate-700">
                        {i + 1}. {programs.find((x) => x.slug === p.programSlug)?.name} —{" "}
                        {campuses.find((c) => c.slug === p.campusSlug)?.shortName}
                      </li>
                    ))}
                  </ul>
                </Review>
                <Review title="Personal details" onEdit={() => setStep(2)}>
                  <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                    <KV k="Name" v={app.personal.fullName} />
                    <KV k="Date of birth" v={app.personal.dob} />
                    <KV k="Gender" v={app.personal.gender} />
                    <KV k="Category" v={app.personal.category} />
                    <KV k={app.personal.idType} v={app.personal.idNumber} />
                    <KV k="City" v={`${app.personal.city} ${app.personal.pin}`} />
                  </dl>
                </Review>
                <Review title="Guardian" onEdit={() => setStep(3)}>
                  <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                    <KV k="Name" v={app.guardian.name} />
                    <KV k="Relation" v={app.guardian.relation} />
                    <KV k="Mobile" v={app.guardian.phone} />
                    <KV k="Income" v={app.guardian.annualIncome} />
                  </dl>
                </Review>
                <Review title="Academics" onEdit={() => setStep(4)}>
                  <ul className="space-y-1">
                    {app.academics.map((a, i) => (
                      <li key={i} className="text-[13px] text-slate-700">
                        {a.level}: {a.board} · {a.yearOfPassing} · {a.marksObtained}/{a.maxMarks} (
                        {a.maxMarks ? ((Number(a.marksObtained) / Number(a.maxMarks)) * 100).toFixed(1) : "0"}%)
                      </li>
                    ))}
                  </ul>
                </Review>
                <Review title="Documents" onEdit={() => setStep(5)}>
                  <ul className="space-y-1">
                    {app.documents.map((d) => (
                      <li key={d.id} className="text-[13px] text-slate-700">
                        {d.kind} — {d.fileName}
                      </li>
                    ))}
                    {app.documents.length === 0 ? <li className="text-[13px] text-rose-600">Nothing uploaded yet</li> : null}
                  </ul>
                </Review>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-300 bg-brand-50/60 p-4">
                  <input
                    type="checkbox"
                    checked={app.declaration}
                    onChange={(e) => setApp({ ...app, declaration: e.target.checked })}
                    className="mt-0.5 h-4 w-4 accent-brand-600"
                  />
                  <span className="text-[12.5px] leading-relaxed text-slate-700">
                    I declare that the information given above is true and complete. I understand that any false
                    statement may lead to cancellation of admission, and I consent to the college verifying my
                    documents with the issuing board or university.
                  </span>
                </label>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-5">
                {app.applicationFee ? (
                  <div className="rounded-xl border border-brand-300 bg-brand-50/60 p-5">
                    <p className="font-display text-xl text-ink">Payment received</p>
                    <p className="mt-1 text-[13px] text-slate-600">
                      {inr(app.applicationFee.amount)} paid on{" "}
                      {new Date(app.applicationFee.paidAt).toLocaleString("en-IN")} · {app.applicationFee.mode}
                    </p>
                    <dl className="mt-3 grid gap-2 text-[12.5px] sm:grid-cols-2">
                      <KV k="Receipt number" v={app.applicationFee.receiptNo} />
                      <KV k="Transaction id" v={app.applicationFee.txnId} />
                    </dl>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/apply/${app.id}/receipt`} className="btn-primary btn-sm">Download receipt (PDF)</Link>
                      <Link href={`/apply/${app.id}/status`} className="btn-outline btn-sm">Go to status tracker</Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-slate-200 p-5">
                      <p className="font-display text-xl text-ink">Application fee</p>
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <p className="text-[12.5px] text-slate-600">Non-refundable · includes entrance test</p>
                          <p className="mt-1 text-[12px] text-slate-500">
                            {firstProgram?.level === "PG" ? "Postgraduate rate ₹1,200" : "Undergraduate / diploma rate ₹750"}
                          </p>
                        </div>
                        <p className="font-display text-3xl text-brand-700">{inr(feeAmount)}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {["UPI (demo)", "Card (demo)", "Netbanking (demo)"].map((m, i) => (
                          <button
                            key={m}
                            onClick={pay}
                            disabled={paying}
                            className={`chip ${i === 0 ? "chip-active" : ""}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                      <button onClick={pay} disabled={paying} className="btn-primary mt-4 w-full">
                        {paying ? "Talking to the gateway…" : `Pay ${inr(feeAmount)} & submit application`}
                      </button>
                      <p className="mt-2 text-center text-[11px] text-slate-400">
                        Demo gateway — no real payment is processed and no card details are collected.
                      </p>
                    </div>
                    <div className="rounded-xl bg-sand p-4 text-[12.5px] leading-relaxed text-slate-700">
                      After payment you can download the receipt immediately, and the tracker will show your
                      verification, entrance test and merit milestones.
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <button onClick={() => go(step - 1)} disabled={step === 1} className="btn-outline btn-sm">
              ← Back
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[11.5px] text-slate-400">
                {state === "saving" ? "Saving…" : state === "saved" ? "All changes saved" : "Autosave on"}
              </span>
              {step < 7 ? (
                <button onClick={() => go(step + 1)} className="btn-primary btn-sm">Save & continue →</button>
              ) : app.applicationFee ? (
                <Link href={`/apply/${app.id}/status`} className="btn-primary btn-sm">Finish</Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="label">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <input
        className="input"
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="label">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Review({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[12.5px] font-bold uppercase tracking-wide text-slate-500">{title}</p>
        <button onClick={onEdit} className="text-[11.5px] font-semibold text-brand-700 hover:underline">Edit</button>
      </div>
      {children}
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="min-w-[92px] text-[12px] text-slate-500">{k}</dt>
      <dd className="text-[13px] font-medium text-ink">{v || "—"}</dd>
    </div>
  );
}
