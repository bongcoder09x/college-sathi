"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApplyRegister() {
  const router = useRouter();
  const [mode, setMode] = useState<"mobile" | "email">("mobile");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"form" | "otp" | "creating">("form");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const sendOtp = async () => {
    setError("");
    setBusy(true);
    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact }),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) return setError(data.error || "Could not send the code.");
    setMessage(data.message);
    setStage("otp");
  };

  const verify = async () => {
    setError("");
    setBusy(true);
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, otp }),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) return setError(data.error || "Verification failed.");
    setStage("creating");
    router.push(`/apply/${data.application.id}`);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-xl">Create your applicant account</p>
        <span className="badge-green">Step 0 of 7</span>
      </div>
      <p className="muted mt-1 text-[13px]">
        We verify your mobile or email with a one-time password. No password to remember.
      </p>

      <div className="mt-4 inline-flex rounded-full border border-slate-300 bg-white p-1">
        {(["mobile", "email"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setContact("");
              setStage("form");
            }}
            className={`rounded-full px-4 py-1.5 text-[13px] font-semibold capitalize ${
              mode === m ? "bg-brand-600 text-white" : "text-slate-600"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {stage === "form" ? (
        <>
          <div className="mt-4">
            <label className="label" htmlFor="contact">
              {mode === "mobile" ? "Mobile number" : "Email address"}
            </label>
            <input
              id="contact"
              className="input"
              placeholder={mode === "mobile" ? "10-digit mobile number" : "you@example.com"}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <button onClick={sendOtp} disabled={busy} className="btn-primary mt-4 w-full">
            {busy ? "Sending…" : "Send OTP"}
          </button>
          <p className="mt-3 text-[11.5px] text-slate-500">
            Demo build: the OTP is displayed on screen instead of being sent by SMS or email.
          </p>
        </>
      ) : (
        <>
          <div className="mt-4 rounded-xl bg-brand-50 px-3 py-2 text-[12.5px] text-brand-800">{message}</div>
          <div className="mt-3">
            <label className="label" htmlFor="otp">Enter the 6-digit code</label>
            <input
              id="otp"
              className="input tracking-[0.4em]"
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button onClick={verify} disabled={busy || stage === "creating"} className="btn-primary mt-4 w-full">
            {stage === "creating" ? "Creating your application…" : busy ? "Verifying…" : "Verify & continue"}
          </button>
          <button onClick={() => setStage("form")} className="btn-ghost btn-sm mt-2 w-full">
            Change number or resend
          </button>
        </>
      )}

      {error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] font-medium text-rose-700">{error}</p> : null}
    </div>
  );
}
