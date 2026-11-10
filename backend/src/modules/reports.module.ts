import { Body, Controller, Get, Module, Post, Query } from "@nestjs/common";

@Controller("reports")
export class ReportsController {
  /** GET /api/reports/dashboard?campusId= — aggregates for the HOD/admin home. */
  @Get("dashboard")
  dashboard(@Query("campusId") campusId?: string) {
    return {
      campusId,
      kpis: { students: 486, attendance: 80, syllabusCoverage: 60, feeCollection: 184000, openTickets: 12 },
      trends: [{ week: "W1", attendance: 86 }, { week: "W2", value: 84 }],
    };
  }

  /** POST /api/reports/exports — saved report → scheduled export job. */
  @Post("exports")
  export(@Body() body: { name: string; definition: any; schedule?: string; recipients?: string[] }) {
    return { reportId: `RP-${Date.now()}`, job: "reports.build", status: "queued", ...body };
  }

  /** GET /api/reports/saved */
  @Get("saved")
  saved() {
    return { reports: [{ id: "RP-1", name: "Attendance shortage — CSE", schedule: "weekly" }] };
  }
}

@Module({ controllers: [ReportsController] })
export class ReportsModule {}
