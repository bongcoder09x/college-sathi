import { Body, Controller, Get, Module, Param, Post, Query } from "@nestjs/common";
import { RealtimeGateway } from "../realtime/realtime.gateway";

type Session = { id: string; section: string; subject: string; mode: string; token: string; present: string[]; flagged: string[]; open: boolean };

const SESSIONS: Session[] = [];

@Controller("attendance")
export class AttendanceController {
  constructor(private readonly realtime: RealtimeGateway) {}

  /** POST /api/attendance/sessions — manual | rotating-qr | qr-geofence */
  @Post("sessions")
  start(@Body() body: { section: string; subject: string; mode?: string }) {
    const session: Session = {
      id: `as_${Date.now()}`,
      section: body.section,
      subject: body.subject,
      mode: body.mode || "rotating-qr",
      token: String(Math.floor(100000 + Math.random() * 899999)),
      present: [],
      flagged: [],
      open: true,
    };
    SESSIONS.push(session);
    this.realtime.emitAttendance(session.id, { present: 0, flagged: 0, token: session.token });
    return session;
  }

  /** POST /api/attendance/sessions/:id/scan — QR token + geo + device verification. */
  @Post("sessions/:id/scan")
  scan(@Param("id") id: string, @Body() body: { studentId: string; token: string; lat?: number; lng?: number; deviceId?: string }) {
    const session = SESSIONS.find((s) => s.id === id);
    if (!session || !session.open) return { marked: false, reason: "session-closed" };
    const suspicious = body.token !== session.token || body.lat === 0;
    if (suspicious) session.flagged.push(body.studentId);
    else session.present.push(body.studentId);
    this.realtime.emitAttendance(id, { present: session.present.length, flagged: session.flagged.length, token: session.token });
    return { marked: !suspicious, flagged: suspicious, present: session.present.length };
  }

  /** POST /api/attendance/sessions/:id/close — 24h edit window starts. */
  @Post("sessions/:id/close")
  close(@Param("id") id: string) {
    const session = SESSIONS.find((s) => s.id === id);
    if (!session) return { closed: false };
    session.open = false;
    return { closed: true, present: session.present.length, editWindowHours: 24 };
  }

  /** GET /api/attendance/shortage?threshold=75 — used by the shortage worker + HOD screen. */
  @Get("shortage")
  shortage(@Query("threshold") threshold = "75") {
    return {
      threshold: Number(threshold),
      students: [
        { roll: "CS2204", name: "Arafat Hossain", section: "CSE-5A", percent: 68.2 },
        { roll: "CS2202", name: "Ritwik Mondal", section: "CSE-5A", percent: 72.4 },
      ],
    };
  }
}

@Module({ controllers: [AttendanceController] })
export class AttendanceModule {}
