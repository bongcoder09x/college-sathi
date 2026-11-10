import { NextResponse } from "next/server";
import { studentProfile } from "@/lib/student";

// Demo student profile for the student dashboard.
export async function GET() {
  return NextResponse.json({ ok: true, student: studentProfile });
}
