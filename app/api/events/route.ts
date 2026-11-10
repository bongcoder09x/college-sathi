import { NextResponse } from "next/server";
import { events } from "@/lib/data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const campus = url.searchParams.get("campus");
  const list = events.filter((e) => !campus || e.campusSlug === campus).sort((a, b) => (a.date < b.date ? -1 : 1));
  return NextResponse.json({ count: list.length, events: list });
}
