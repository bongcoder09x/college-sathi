import { Body, Controller, Get, Module, Param, Post } from "@nestjs/common";

@Controller("transport")
export class TransportController {
  /** GET /api/transport/routes/:id — route, stops, vehicle, driver, ETA. */
  @Get("routes/:id")
  route(@Param("id") id: string) {
    return {
      routeId: id,
      vehicle: "WB 02 AC 4412",
      driver: { name: "B. Mondal", phone: "+91 98311 22004" },
      stops: [
        { name: "Lake Gardens", at: "08:42" },
        { name: "Rabindra Sarobar", at: "08:50" },
        { name: "Ballygunge Place", at: "08:58" },
        { name: "Main Campus", at: "09:12" },
      ],
      etaMinutes: 8,
    };
  }

  /** POST /api/transport/gps — device ingest; normally MQTT → Redis stream → worker. */
  @Post("gps")
  gps(@Body() body: { routeId: string; lat: number; lng: number; speedKph?: number }) {
    return { ingested: true, channel: `bus:${body.routeId}`, ...body, at: new Date().toISOString() };
  }

  /** POST /api/transport/assignments — student ↔ route ↔ stop. */
  @Post("assignments")
  assign(@Body() body: { studentId: string; routeId: string; stop: string }) {
    return { assignmentId: `TA-${Date.now()}`, passNo: `BP-2026-${Math.floor(Math.random() * 9000) + 1000}`, ...body };
  }
}

@Module({ controllers: [TransportController] })
export class TransportModule {}
