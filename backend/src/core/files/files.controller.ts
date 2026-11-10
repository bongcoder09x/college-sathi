import { Body, Controller, Post } from "@nestjs/common";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
  constructor(private readonly files: FilesService) {}

  /** POST /api/files/presign — returns a signed PUT url and queues a virus scan. */
  @Post("presign")
  presign(@Body() body: { fileName: string; mime: string; size: number; kind?: string }) {
    return this.files.presign({ ...body, kind: body.kind || "documents" });
  }
}
