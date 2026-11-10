import { NextResponse } from "next/server";
import { checkOtp, createApplication } from "@/lib/store";

export async function POST(req: Request) {
  const { contact, otp } = await req.json();
  if (!checkOtp(String(contact || ""), String(otp || ""))) {
    return NextResponse.json({ ok: false, error: "That code is not correct. Try again or resend." }, { status: 400 });
  }
  const application = createApplication(String(contact).includes("@") ? String(contact) : "", String(contact).includes("@") ? "" : String(contact));
  return NextResponse.json({ ok: true, application });
}
