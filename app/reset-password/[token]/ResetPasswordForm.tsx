"use client";

import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const strength = Math.min(4, Math.floor(pwd.length / 3) + (/[A-Z]/.test(pwd) ? 1 : 0) + (/\d/.test(pwd) ? 1 : 0));

  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-md card p-7">
        <p className="eyebrow">Reset password</p>
        <h1 className="h2 mt-2">Choose a new password</h1>
        <p className="muted mt-2 text-[13px]">
          Reset token <span className="font-mono text-[12px] text-ink">{token}</span> is valid for this demo.
        </p>

        {done ? (
          <div className="mt-5 rounded-xl border border-brand-300 bg-brand-50/60 p-4">
            <p className="text-[13px] font-semibold text-ink">Password updated</p>
            <p className="mt-1 text-[12px] text-slate-600">You can now sign in with your new password.</p>
            <Link href="/login" className="btn-primary btn-sm mt-3">Go to sign in</Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              if (pwd.length < 8) return setError("Use at least 8 characters.");
              if (pwd !== confirm) return setError("The two passwords do not match.");
              setDone(true);
            }}
            className="mt-5 space-y-3"
          >
            <div>
              <label className="label" htmlFor="p1">New password</label>
              <input id="p1" type="password" className="input" value={pwd} onChange={(e) => setPwd(e.target.value)} />
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`h-1 flex-1 rounded-full ${i < strength ? "bg-brand-600" : "bg-beige"}`} />
                ))}
              </div>
              <p className="mt-1 text-[10.5px] text-slate-500">Mix upper case, numbers and a symbol.</p>
            </div>
            <div>
              <label className="label" htmlFor="p2">Confirm password</label>
              <input id="p2" type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-medium text-rose-700">{error}</p> : null}
            <button className="btn-primary w-full">Update password</button>
          </form>
        )}
      </div>
    </div>
  );
}
