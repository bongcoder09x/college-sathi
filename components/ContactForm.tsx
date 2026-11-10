"use client";

import { useState } from "react";
import { campuses, programs } from "@/lib/data";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    campus: "",
    message: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [lead, setLead] = useState<any>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      setState("error");
      return;
    }
    setState("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.ok) {
      setLead(data.enquiry);
      setState("done");
    } else {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m4 12 5 5L20 6" /></svg>
        </div>
        <p className="mt-4 font-display text-2xl">Enquiry received</p>
        <p className="muted mx-auto mt-2 max-w-sm">
          Your enquiry is logged as <strong className="text-ink">{lead?.id}</strong> and pushed to the CRM queue.
          A counsellor calls back within one working day.
        </p>
        <button
          className="btn-outline btn-sm mt-5"
          onClick={() => {
            setForm({ name: "", email: "", phone: "", program: "", campus: "", message: "" });
            setState("idle");
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Full name *</label>
          <input id="name" className="input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Mobile number *</label>
          <input id="phone" className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit mobile" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label" htmlFor="campus">Preferred campus</label>
          <select id="campus" className="input" value={form.campus} onChange={(e) => set("campus", e.target.value)}>
            <option value="">Any campus</option>
            {campuses.map((c) => (
              <option key={c.slug} value={c.name}>{c.shortName}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="program">Programme of interest</label>
          <select id="program" className="input" value={form.program} onChange={(e) => set("program", e.target.value)}>
            <option value="">Not decided yet</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="message">Your question *</label>
          <textarea id="message" rows={4} className="input resize-none" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Fees, hostel, eligibility, scholarships…" />
        </div>
      </div>
      {state === "error" ? (
        <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] font-medium text-rose-700">
          Please fill your name, mobile number and question.
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11.5px] text-slate-500">Demo form — the enquiry is stored in memory and shown in the admin panel.</p>
        <button className="btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
