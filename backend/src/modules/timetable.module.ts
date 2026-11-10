import { Body, Controller, Get, Module, Param, Post } from "@nestjs/common";
import { TimetableQueue, WorkersModule } from "../workers/workers.module";

@Controller("timetable")
export class TimetableController {
  constructor(private readonly queue: TimetableQueue) {}

  /** POST /api/timetable/generate — async solver job, progress streamed on timetable:job:{id}. */
  @Post("generate")
  generate(@Body() body: { campusId?: string; constraints?: any }) {
    const jobId = `tt_job_${Date.now()}`;
    this.queue.enqueue({ jobId, ...body });
    return { jobId, status: "queued", channel: `timetable:job:${jobId}`, constraints: body.constraints || {} };
  }

  /** GET /api/timetable?section=CSE-5A */
  @Get()
  current() {
    return {
      version: "v3",
      publishedAt: "2026-11-02",
      grid: {
        Mon: ["CSE501 · 5A · CS-204", "CSE502 · 5A · CS-108", "CSE503 · 5A · CS-301", "Lab: Networks"],
        Tue: ["CSE502 · 5B · CS-108", "CSE501 · 5B · CS-205", "CSE505 · 5A · Studio A", "—"],
      },
    };
  }

  /** POST /api/timetable/publish — versioned publish. */
  @Post("publish")
  publish(@Body() body: { grid: any; note?: string }) {
    return { published: true, version: "v4", publishedAt: new Date().toISOString(), note: body.note };
  }

  /** POST /api/timetable/substitutions */
  @Post("substitutions")
  substitution(@Body() body: { facultyId: string; slot: string; date: string; reason: string }) {
    return { id: `SUB-${Math.floor(Math.random() * 90) + 10}`, status: "Requested", ...body };
  }

  /** GET /api/timetable/:section/ics — calendar export. */
  @Get(":section/ics")
  ics(@Param("section") section: string) {
    return { section, mime: "text/calendar", body: "BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR" };
  }
}

@Module({ imports: [WorkersModule], controllers: [TimetableController] })
export class TimetableModule {}
