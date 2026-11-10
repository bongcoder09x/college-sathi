import { NextResponse } from "next/server";
import { issueOtp } from "@/lib/store";

export async function POST(req: Request) {
  const { contact } = await req.json();
  if (!contact || String(contact).trim().length < 5) {
    return NextResponse.json({ ok: false, error: "Enter a valid email or 10-digit mobile number" }, { status: 400 });
  }
  const otp = issueOtp(String(contact));
  // Demo only: the OTP is returned so the flow can be completed without an SMS gateway.
  return NextResponse.json({
    ok: true,
    channel: String(contact).includes("@") ? "email" : "sms",
    masked: mask(String(contact)),
    demoOtp: otp,
    message: `A 6-digit code was sent to ${mask(String(contact))} (demo: ${otp})`,
  });
}

function mask(v: string) {
  if (v.includes("@")) {
    const [name, domain] = v.split("@");
    return `${name.slice(0, 2)}${"•".repeat(Math.max(2, name.length - 2))}@${domain}`;
  }
  return `${v.slice(0, 2)}${"•".repeat(Math.max(2, v.length - 4))}${v.slice(-2)}`;
}
