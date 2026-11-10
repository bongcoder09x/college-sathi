import { NextResponse } from "next/server";
import { getApplication, updateApplication } from "@/lib/store";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const application = getApplication(params.id);
  if (!application) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, application });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const allowed = [
    "step",
    "preferences",
    "personal",
    "guardian",
    "academics",
    "documents",
    "declaration",
  ] as const;
  const patch: Record<string, unknown> = {};
  for (const key of allowed) if (key in body) patch[key] = body[key];
  const application = updateApplication(params.id, patch);
  if (!application) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, application, savedAt: application.updatedAt });
}
