import { NextResponse } from "next/server";
import { getApplication, pushTimeline, updateApplication } from "@/lib/store";
import { getProgram } from "@/lib/data";

/**
 * Demo payment gateway. No real money moves: we mint a fake transaction id and
 * receipt number, then mark the fee as paid on the application.
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const app = getApplication(params.id);
  if (!app) return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });
  const { kind = "application", mode = "UPI (demo)" } = await req.json().catch(() => ({}));

  const programSlug = app.offer.programSlug || app.preferences[0]?.programSlug;
  const program = programSlug ? getProgram(programSlug) : undefined;
  const amount =
    kind === "admission"
      ? (program?.feesPerYear || 100000) + 12500
      : program?.level === "PG"
      ? 1200
      : 750;

  const record = {
    paid: true,
    amount,
    txnId: `pay_DEMO${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    paidAt: new Date().toISOString(),
    receiptNo: `RCPT-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`,
    mode,
  };

  if (kind === "admission") {
    updateApplication(params.id, { admissionFee: record });
    if (app.offer.status === "accepted") pushTimeline(params.id, "enrolled", "Admission fee paid — enrolled", record.receiptNo);
  } else {
    updateApplication(params.id, { applicationFee: record });
    if (app.status === "draft") pushTimeline(params.id, "submitted", "Application submitted", "7 steps completed");
  }

  return NextResponse.json({ ok: true, payment: record, application: getApplication(params.id) });
}
