import { NextResponse } from "next/server";
import { programs } from "@/lib/data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const campus = url.searchParams.get("campus");
  const level = url.searchParams.get("level");
  const mode = url.searchParams.get("mode");
  const list = programs.filter(
    (p) =>
      (!campus || p.campuses.includes(campus)) &&
      (!level || p.level === level) &&
      (!mode || p.mode === mode)
  );
  return NextResponse.json({ count: list.length, programs: list });
}
