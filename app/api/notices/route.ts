import { NextResponse } from "next/server";
import { notices } from "@/lib/data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const list = notices
    .filter((n) => (!category || n.category === category) && (!q || (n.title + n.summary).toLowerCase().includes(q)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return NextResponse.json({ count: list.length, notices: list });
}
