"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-md card p-7">
        <p className="eyebrow">Account recovery</p>
        <h1 className="h2 mt-2">Forgot your password?</h1>
        <p className="muted mt-2 text-[13px]">
          Enter the email or mobile registered with the college. We send a single-use reset link that expires in 30
          minutes.
        </p>

        {sent ? (
          <div className="mt-5 rounded-xl border border-brand-300 bg-brand-50/60 p-4">
            <p className="text-[13px] font-semibold text-ink">Reset link sent</p>
            <p className="mt-1 text-[12px] text-slate-600">
              If an account exists for <strong className="text-ink">{email || "your address"}</strong>, a reset link is
              on its way.
            </p>
            <Link href="/reset-password/demo-token" className="btn-primary btn-sm mt-3">Open the demo reset link</Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mt-5 space-y-3"
          >
            <div>
              <label className="label" htmlFor="em">Email or mobile</label>
              <input id="em" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <button className="btn-primary w-full">Send reset link</button>
          </form>
        )}

        <Link href="/login" className="btn-ghost btn-sm mt-4">← Back to sign in</Link>
      </div>
    </div>
  );
}
