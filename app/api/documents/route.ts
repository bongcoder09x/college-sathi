import { NextResponse } from "next/server";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED = ["application/pdf", "image/jpeg", "image/png"];

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const kind = String(form.get("kind") || "Document");
  if (!file) return NextResponse.json({ ok: false, error: "No file received" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ ok: false, error: "Only PDF, JPG or PNG files are accepted" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "File is larger than 2 MB" }, { status: 413 });
  }
  // Demo: the file is not persisted, only its metadata.
  return NextResponse.json({
    ok: true,
    document: {
      id: `DOC-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      kind,
      fileName: file.name,
      size: file.size,
      mime: file.type,
      status: "uploaded",
    },
  });
}
