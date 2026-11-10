import { NextResponse } from "next/server";
import { publishedResults } from "@/lib/data";

export async function POST(req: Request) {
  const { rollNo, dob } = await req.json();
  const key = String(rollNo || "").trim().toUpperCase();
  const record = publishedResults[key];
  if (!record) {
    return NextResponse.json({
      found: false,
      message: `No result published for roll number ${key || "—"}. Check the number printed on your admit card.`,
    });
  }
  if (record.dob !== dob) {
    return NextResponse.json({
      found: false,
      message: "The date of birth does not match our records for this roll number.",
    });
  }
  return NextResponse.json({ found: true, result: record });
}
