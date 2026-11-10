import { NextResponse } from "next/server";
import { resolveTenant } from "@/lib/tenant";

export async function GET(req: Request) {
  const host = req.headers.get("host");
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/cs_campus=([^;]+)/);
  return NextResponse.json(resolveTenant(host, match?.[1]));
}
