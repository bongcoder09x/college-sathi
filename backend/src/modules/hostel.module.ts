import { Body, Controller, Get, Module, Param, Post, Query } from "@nestjs/common";

@Controller("hostel")
export class HostelController {
  /** GET /api/hostel/blocks — blocks, rooms, beds, occupancy. */
  @Get("blocks")
  blocks(@Query("campusId") campusId?: string) {
    return {
      campusId,
      blocks: [{ id: "B", beds: 220, occupied: 198 }, { id: "A", beds: 180, occupied: 171 }],
    };
  }

  /** POST /api/hostel/applications — hostel application + allocation. */
  @Post("applications")
  apply(@Body() body: { studentId: string; preference?: string }) {
    return { applicationId: `HA-${Date.now()}`, ...body, status: "Submitted" };
  }

  /** POST /api/hostel/outpass — parent approval is requested here. */
  @Post("outpass")
  outpass(@Body() body: { studentId: string; reason: string; from: string; to: string }) {
    return { outpassId: `OP-${Math.floor(Math.random() * 900) + 100}`, status: "Pending", approval: "parent", ...body };
  }

  /** POST /api/hostel/gate-log — gate entry/exit scan. */
  @Post("gate-log")
  gate(@Body() body: { studentId: string; direction: "in" | "out"; gate: string }) {
    return { logged: true, at: new Date().toISOString(), ...body };
  }

  /** POST /api/hostel/complaints */
  complaint(@Body() body: { studentId: string; subject: string; body: string }) {
    return { complaintId: `HC-${Date.now()}`, status: "Open", ...body };
  }
}

@Module({ controllers: [HostelController] })
export class HostelModule {}
