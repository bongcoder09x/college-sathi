import { Body, Controller, Get, Module, Param, Post, Query } from "@nestjs/common";

@Controller("parents")
export class ParentsController {
  /** GET /api/parents/wards?parentId= — child switcher across campuses. */
  @Get("wards")
  wards(@Query("parentId") parentId?: string) {
    return {
      parentId,
      wards: [
        { studentId: "usr_stu_1", name: "Ananya Dasgupta", campusId: "cmp_main", attendance: 81.9, feeDue: 2400 },
        { studentId: "usr_stu_3", name: "Riddhi Dasgupta", campusId: "cmp_north", attendance: 92.4, feeDue: 0 },
      ],
    };
  }

  /** POST /api/parents/outpass/:id/decision — approve or reject a hostel outpass. */
  @Post("outpass/:id/decision")
  decide(@Param("id") id: string, @Body() body: { decision: "approve" | "reject"; note?: string }) {
    return { outpassId: id, status: body.decision === "approve" ? "Approved" : "Rejected", note: body.note };
  }

  /** GET /api/parents/ptm-slots?date= */
  @Get("ptm-slots")
  slots() {
    return { days: [{ date: "2026-11-16", slots: ["10:00", "10:20", "10:40"] }, { date: "2026-11-17", slots: ["14:00", "14:20"] }] };
  }

  /** POST /api/parents/ptm-bookings */
  book(@Body() body: { parentId: string; studentId: string; slot: string }) {
    return { bookingId: `PTM-${Date.now()}`, status: "Booked", ...body };
  }

  /** POST /api/parents/messages — thread with the class mentor. */
  @Post("messages")
  message(@Body() body: { parentId: string; toUserId: string; text: string }) {
    return { messageId: `pm_${Date.now()}`, ...body, at: new Date().toISOString() };
  }
}

@Module({ controllers: [ParentsController] })
export class ParentsModule {}
