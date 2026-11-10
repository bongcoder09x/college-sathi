import { NextResponse } from "next/server";
import { createApplication, listApplications } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ applications: listApplications() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body?.email || "");
  const phone = String(body?.phone || "");
  if (!email && !phone) {
    return NextResponse.json({ ok: false, error: "Email or phone is required" }, { status: 400 });
  }
  const application = createApplication(email, phone);
  return NextResponse.json({ ok: true, application });
}
