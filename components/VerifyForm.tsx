"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyForm() {
  const [id, setId] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!id.trim()) return;
        router.push(`/verify/${encodeURIComponent(id.trim().toUpperCase())}`);
      }}
      className="card p-5"
    >
      <label className="label" htmlFor="cert">Certificate / verification ID</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="cert"
          className="input uppercase"
          placeholder="CS-CERT-2024-001"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button className="btn-primary shrink-0">Verify</button>
      </div>
      <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">
        Try <strong>CS-CERT-2024-001</strong> (valid), <strong>CS-CERT-2025-047</strong> (valid) or{" "}
        <strong>CS-CERT-2023-119</strong> (revoked). Any other ID returns “not found”.
      </p>
    </form>
  );
}
