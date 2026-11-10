import { NextResponse } from "next/server";
import { getApplication, pushTimeline, updateApplication } from "@/lib/store";

const FLOW = ["draft", "submitted", "verified", "merit", "offered", "enrolled"];

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const app = getApplication(params.id);
  if (!app) return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });
  const { action } = await req.json();

  if (action === "advance") {
    const idx = FLOW.indexOf(app.status);
    const next = FLOW[Math.min(idx + 1, FLOW.length - 1)];
    const labels: Record<string, string> = {
      submitted: "Application submitted",
      verified: "Documents verified",
      merit: "Merit rank published",
      offered: "Offer letter issued",
      enrolled: "Admission fee paid — enrolled",
    };
    if (next === "offered") {
      updateApplication(params.id, {
        offer: {
          status: "issued",
          programSlug: app.preferences[0]?.programSlug,
          campusSlug: app.preferences[0]?.campusSlug,
          issuedAt: new Date().toISOString(),
          deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
        },
      });
    }
    pushTimeline(params.id, next, labels[next] || next, "Advanced from the staff console");
    return NextResponse.json({ ok: true, application: getApplication(params.id) });
  }

  if (action === "reject") {
    pushTimeline(params.id, "rejected", "Application rejected", "Documents did not meet the requirement");
    return NextResponse.json({ ok: true, application: getApplication(params.id) });
  }

  if (action === "accept-offer") {
    updateApplication(params.id, { offer: { ...app.offer, status: "accepted" } });
    pushTimeline(params.id, "offered", "Offer accepted by candidate", "Admission fee pending");
    return NextResponse.json({ ok: true, application: getApplication(params.id) });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
