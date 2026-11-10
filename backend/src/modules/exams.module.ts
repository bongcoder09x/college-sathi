import { Body, Controller, Get, Module, Param, Post, Query } from "@nestjs/common";

@Controller("exams")
export class ExamsController {
  /** GET /api/exams/schedule?section=CSE-5A */
  @Get("schedule")
  schedule(@Query("section") section?: string) {
    return {
      section,
      term: "2026-odd",
      papers: [
        { code: "CSE501", date: "2026-12-08", time: "10:00-13:00", hall: "Hall A", seat: "A-14" },
        { code: "CSE502", date: "2026-12-10", time: "10:00-13:00", hall: "Hall A", seat: "A-15" },
      ],
    };
  }

  /** POST /api/exams/hall-tickets — queued PDF render for a batch. */
  @Post("hall-tickets")
  hallTickets(@Body() body: { section: string }) {
    return { job: "pdf.render", type: "hall-ticket", section: body.section, status: "queued" };
  }

  /** POST /api/exams/marks — faculty marks entry, goes to moderation. */
  @Post("marks")
  marks(@Body() body: { code: string; section: string; rows: { roll: string; marks: number }[] }) {
    return { accepted: body.rows?.length || 0, status: "submitted-for-moderation", code: body.code };
  }

  /** POST /api/exams/marks/moderate — HOD approve or return. */
  @Post("marks/moderate")
  moderate(@Body() body: { code: string; decision: "approve" | "return"; note?: string }) {
    return { code: body.code, status: body.decision === "approve" ? "approved" : "returned", note: body.note };
  }

  /** POST /api/exams/revaluation */
  revaluation(@Body() body: { roll: string; code: string }) {
    return { requestId: `RV-${Date.now()}`, ...body, status: "Requested", fee: 500 };
  }

  /** GET /api/exams/results/:roll */
  result(@Param("roll") roll: string) {
    return { roll, sgpa: 8.62, cgpa: 8.41, status: "published" };
  }
}

@Module({ controllers: [ExamsController] })
export class ExamsModule {}
