"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/session";

const providers = [
  { id: "google", name: "Google Workspace", note: "collegesathi.edu.in", tone: "from-brand-500 to-brand-800" },
  { id: "microsoft", name: "Microsoft 365", note: "Staff & faculty accounts", tone: "from-slate-600 to-slate-900" },
];

export default function SsoPage() {
  const router = useRouter();
  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-lg">
        <p className="eyebrow">Single sign-on</p>
        <h1 className="h2 mt-2">Sign in with your work account</h1>
        <p className="muted mt-2 text-[13px]">
          Staff and faculty use the college's Google Workspace or Microsoft 365 identity. Students and parents should
          use the password or OTP form.
        </p>

        <div className="mt-6 space-y-3">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                signIn({
                  name: "Dr. A. Sengupta",
                  role: "Staff",
                  campus: "Main Campus",
                  email: p.id === "google" ? "a.sengupta@collegesathi.edu.in" : "a.sengupta@collegesathi.onmicrosoft.com",
                  method: "sso",
                });
                router.push("/select-campus");
              }}
              className="card card-hover flex w-full items-center gap-4 p-4 text-left"
            >
              <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${p.tone} font-display text-lg text-ivory`}>
                {p.id === "google" ? "G" : "M"}
              </span>
              <span className="flex-1">
                <span className="block text-[13.5px] font-semibold text-ink">{p.name}</span>
                <span className="block text-[11.5px] text-slate-500">{p.note}</span>
              </span>
              <span className="text-[12px] font-semibold text-brand-700">Continue →</span>
            </button>
          ))}
        </div>

        <p className="mt-5 text-[11.5px] text-slate-500">
          Demo: both providers sign you in as staff and take you to the campus picker. No real OAuth exchange happens.
        </p>
        <Link href="/login" className="btn-ghost btn-sm mt-3">← Back to password login</Link>
      </div>
    </div>
  );
}
