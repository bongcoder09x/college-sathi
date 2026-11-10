import { NextResponse } from "next/server";
import { listApplications, updateApplication } from "@/lib/store";

export async function GET() {
  const applications = listApplications();
  const byStatus = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});
  return NextResponse.json({ count: applications.length, byStatus, applications });
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  const application = updateApplication(id, { status });
  if (!application) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, application });
}
