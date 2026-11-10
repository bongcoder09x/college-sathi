"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { signIn } from "@/lib/session";

export default function TwoFactorPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setAt = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = clean;
    setDigits(next);
    if (clean && i < 5) refs.current[i + 1]?.focus();
  };

  const code = digits.join("");

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return setError("Enter all six digits from your authenticator app.");
    if (code !== "482913") return setError("That code is not valid. Demo TOTP is 482913.");
    signIn({
      name: "Registrar office",
      role: "Admin",
      campus: "Main Campus",
      email: "registrar@collegesathi.edu.in",
      method: "password",
      twoFactor: true,
    });
    router.push("/admin");
  };

  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-md card p-7">
        <p className="eyebrow">Two-factor authentication</p>
        <h1 className="h2 mt-2">Enter your authenticator code</h1>
        <p className="muted mt-2 text-[13px]">
          Admin and accounts roles need a time-based code from the college authenticator app. Codes rotate every 30
          seconds.
        </p>

        <form onSubmit={verify} className="mt-6">
          <div className="flex justify-between gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                value={d}
                onChange={(e) => setAt(i, e.target.value)}
                inputMode="numeric"
                maxLength={1}
                className="input h-14 w-full text-center font-display text-xl"
              />
            ))}
          </div>
          {error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-medium text-rose-700">{error}</p> : null}
          <button className="btn-primary mt-4 w-full">Verify & continue</button>
          <p className="mt-3 text-center text-[11px] text-slate-500">Demo code: 482913</p>
        </form>

        <div className="mt-4 flex justify-between text-[11.5px]">
          <Link href="/login" className="font-semibold text-brand-700 hover:underline">← Use another account</Link>
          <span className="text-slate-400">Lost your device? Call the IT desk</span>
        </div>
      </div>
    </div>
  );
}
