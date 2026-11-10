"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { demoAccounts, signIn, type Role } from "@/lib/session";
import { BRAND } from "@/lib/data";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [role, setRole] = useState<Role>("Student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const go = (r: Role) => {
    if (r === "Staff") router.push("/select-campus");
    else if (r === "Admin") router.push("/2fa");
    else router.push("/student");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!identifier.trim()) return setError("Enter your username, email or mobile number.");
    if (mode === "password" && password.length < 4) return setError("Enter your password (demo: any 4+ characters).");
    if (mode === "otp" && otp !== "482913") return setError("That OTP is not correct. Demo OTP is 482913.");
    setBusy(true);
    signIn({
      name: demoAccounts.find((a) => a.role === role)?.name || identifier,
      role,
      campus: "Main Campus",
      email: identifier.includes("@") ? identifier : `${identifier}@example.com`,
      method: mode === "otp" ? "otp" : "password",
    });
    go(role);
  };

  return (
    <div className="shell grid gap-10 py-12 lg:grid-cols-[1fr_460px] lg:items-center">
      <div className="hidden lg:block">
        <p className="eyebrow">{BRAND.latin} · secure sign-in</p>
        <h1 className="h1 mt-3 max-w-xl">
          One login for <span className="italic text-brand-700 underline decoration-accent-400 decoration-[3px] underline-offset-[10px]">students, parents and staff</span>
        </h1>
        <p className="muted mt-4 max-w-md">
          Password, OTP or single sign-on — whichever your role uses. Parents sign in with a one-time password sent to
          the registered mobile; staff use Google Workspace or Microsoft; admins add a TOTP second factor.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {[
            ["Password", "Students & staff"],
            ["OTP login", "Parents"],
            ["SSO", "Google / Microsoft"],
            ["2FA", "Admins & accounts"],
          ].map(([t, d]) => (
            <div key={t} className="card p-3">
              <p className="text-[12.5px] font-semibold text-ink">{t}</p>
              <p className="text-[11px] text-slate-500">{d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-ivory ring-1 ring-accent-500/40">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M3 9.5 12 4l9 5.5" /><path d="M5 11v8h14v-8" /></svg>
          </span>
          <div>
            <p className="font-display text-xl leading-none">{BRAND.name}</p>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-accent-600">{BRAND.latin}</p>
          </div>
        </div>

        <div className="mt-5 inline-flex w-full rounded-full border border-beige bg-ivory/60 p-1">
          {(["password", "otp"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`flex-1 rounded-full px-4 py-1.5 text-[12.5px] font-semibold capitalize transition ${
                mode === m ? "bg-brand-600 text-ivory" : "text-slate-600"
              }`}
            >
              {m === "otp" ? "OTP (parents)" : "Password"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="label" htmlFor="ident">Username / email / mobile</label>
            <input id="ident" className="input" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="ananya.dasgupta@example.com" />
          </div>

          {mode === "password" ? (
            <div>
              <label className="label" htmlFor="pwd">Password</label>
              <input id="pwd" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              <div className="mt-1.5 flex justify-between text-[11.5px]">
                <Link href="/forgot-password" className="font-semibold text-brand-700 hover:underline">Forgot password?</Link>
                <span className="text-slate-400">Demo: any 4+ characters</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="label" htmlFor="otp">One-time password</label>
              <div className="flex gap-2">
                <input id="otp" className="input tracking-[0.35em]" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="••••••" />
                <button
                  type="button"
                  onClick={() => setOtpSent(true)}
                  className="btn-outline btn-sm shrink-0"
                >
                  Send OTP
                </button>
              </div>
              {otpSent ? <p className="mt-1.5 text-[11.5px] text-brand-700">OTP sent to the registered mobile (demo: 482913).</p> : null}
            </div>
          )}

          <div>
            <label className="label" htmlFor="role">Sign in as</label>
            <select id="role" className="input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              {["Student", "Parent", "Staff", "Admin"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-medium text-rose-700">{error}</p> : null}

          <button className="btn-primary w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>

        <div className="my-4 flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-400">
          <span className="h-px flex-1 bg-beige" /> or <span className="h-px flex-1 bg-beige" />
        </div>

        <Link href="/login/sso" className="btn-outline w-full">Continue with Google Workspace / Microsoft</Link>

        <div className="mt-5 rounded-xl border border-beige bg-ivory/60 p-3">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">Demo accounts</p>
          <div className="mt-2 grid gap-1.5">
            {demoAccounts.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => {
                  setRole(a.role);
                  setIdentifier(a.email);
                  setPassword("demo1234");
                  setMode("password");
                }}
                className="flex items-center justify-between rounded-lg px-2 py-1 text-left text-[11.5px] text-slate-600 transition hover:bg-brand-50"
              >
                <span className="font-semibold text-ink">{a.label}</span>
                <span className="truncate">{a.email}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10.5px] leading-relaxed text-slate-500">
            Admin and staff accounts continue to the campus picker and the 2FA screen.
          </p>
        </div>
      </div>
    </div>
  );
}
