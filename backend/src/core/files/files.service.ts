import { Injectable } from "@nestjs/common";

/**
 * Presigned upload / signed download with a virus-scan hook.
 * In production the scan result comes back from the worker queue; the demo
 * returns a queued status immediately.
 */
@Injectable()
export class FilesService {
  presign(input: { fileName: string; mime: string; size: number; kind: string }) {
    const key = `${input.kind}/${Date.now()}-${input.fileName.replace(/\s+/g, "-")}`;
    return {
      key,
      uploadUrl: `https://files.collegesathi.edu.in/${key}?signature=demo`,
      method: "PUT",
      maxBytes: 2 * 1024 * 1024,
      scan: { status: "queued", job: "files.scan" },
      downloadUrl: `https://files.collegesathi.edu.in/${key}?signature=demo&download=1`,
      expiresIn: 900,
    };
  }
}
