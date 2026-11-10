import { Body, Controller, Get, Module, Param, Patch, Post, Query } from "@nestjs/common";

@Controller("helpdesk")
export class HelpdeskController {
  /** POST /api/helpdesk/tickets */
  @Post("tickets")
  create(@Body() body: { requesterId: string; subject: string; category: string; body?: string }) {
    return { ticketId: `HD-${Math.floor(Math.random() * 9000) + 1000}`, status: "Open", slaHours: 24, assignedTo: "auto-route", ...body };
  }

  /** PATCH /api/helpdesk/tickets/:id — status / assignment. */
  @Patch("tickets/:id")
  update(@Param("id") id: string, @Body() body: { status?: string; assigneeId?: string }) {
    return { ticketId: id, updated: true, ...body };
  }

  /** GET /api/helpdesk/sla — breach dashboard. */
  @Get("sla")
  sla(@Query("campusId") campusId?: string) {
    return { campusId, open: 12, breached: 2, averageResolutionHours: 11.4 };
  }
}

@Module({ controllers: [HelpdeskController] })
export class HelpdeskModule {}
