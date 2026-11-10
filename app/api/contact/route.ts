import { NextResponse } from "next/server";
import { addEnquiry } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.name || !body?.phone || !body?.message) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }
  const enquiry = addEnquiry({
    name: body.name,
    email: body.email || "",
    phone: body.phone,
    program: body.program || "Not decided",
    campus: body.campus || "Any campus",
    message: body.message,
    source: "Website contact form",
  });
  return NextResponse.json({ ok: true, enquiry });
}
