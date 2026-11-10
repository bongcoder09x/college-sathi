"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inr } from "@/lib/utils";

export default function StatusActions({
  id,
  offerIssued,
  offerAccepted,
  admissionPaid,
  admissionAmount,
}: {
  id: string;
  offerIssued: boolean;
  offerAccepted: boolean;
  admissionPaid: boolean;
  admissionAmount: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const call = async (path: string, body: any) => {
    setBusy(path);
    await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(null);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {offerIssued && !offerAccepted ? (
        <button
          onClick={() => call(`/api/applications/${id}/status`, { action: "accept-offer" })}
          disabled={busy !== null}
          className="btn-primary btn-sm"
        >
          {busy ? "Working…" : "Accept the offer"}
        </button>
      ) : null}
      {offerAccepted && !admissionPaid ? (
        <button
          onClick={() => call(`/api/applications/${id}/payment`, { kind: "admission", mode: "Netbanking (demo)" })}
          disabled={busy !== null}
          className="btn-accent btn-sm"
        >
          {busy ? "Processing…" : `Pay admission fee ${inr(admissionAmount)}`}
        </button>
      ) : null}
    </div>
  );
}
