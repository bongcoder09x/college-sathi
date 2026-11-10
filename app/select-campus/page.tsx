"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { campuses } from "@/lib/data";
import { signIn, useSession } from "@/lib/session";

export default function SelectCampusPage() {
  const router = useRouter();
  const { session } = useSession();
  const [picked, setPicked] = useState<string | null>(null);

  const choose = (slug: string) => {
    setPicked(slug);
    const campus = campuses.find((c) => c.slug === slug);
    signIn({
      name: session?.name || "Dr. A. Sengupta",
      role: session?.role || "Staff",
      campus: campus?.shortName || "Main Campus",
      email: session?.email || "a.sengupta@collegesathi.edu.in",
      method: session?.method || "password",
    });
    router.push("/admin");
  };

  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Multi-campus staff</p>
        <h1 className="h2 mt-2">Which campus are you working in today?</h1>
        <p className="muted mt-2 text-[13px]">
          You have access to all four campuses. Your choice sets the default scope for approvals, attendance and fee
          counters — you can switch again from the header.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {campuses.map((c) => (
            <button
              key={c.slug}
              onClick={() => choose(c.slug)}
              className={`card card-hover p-5 text-left ${picked === c.slug ? "border-brand-500" : ""}`}
            >
              <div className={`mb-3 h-16 rounded-xl bg-gradient-to-br ${c.gallery[0].tone}`} />
              <p className="font-display text-lg text-ink">{c.shortName}</p>
              <p className="text-[11.5px] text-slate-500">{c.city} · est. {c.established}</p>
              <p className="mt-2 text-[11.5px] text-slate-500">{c.stats[0].value} programmes · {c.stats[1].value} students</p>
            </button>
          ))}
        </div>

        <p className="mt-5 text-[11.5px] text-slate-500">
          Demo: choosing a campus signs you in as staff and opens the staff console.
        </p>
      </div>
    </div>
  );
}
