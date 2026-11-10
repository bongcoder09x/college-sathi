import { Logger } from "@nestjs/common";
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

/**
 * Socket.IO gateway. Channels (rooms) used by the web app:
 *   attendance:session:{id}  → live present/flagged counts, rotating QR token
 *   bus:{routeId}            → GPS positions + ETA
 *   notify:user:{id}         → in-app notifications
 *   timetable:job:{id}       → solver progress
 * In production the Redis adapter (@socket.io/redis-adapter) fans these out
 * across pods; here the gateway works in-process.
 */
@WebSocketGateway({ cors: { origin: process.env.PUBLIC_WEB_ORIGIN || "*" } })
export class RealtimeGateway implements OnGatewayConnection {
  private readonly log = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const { channel } = client.handshake.query as { channel?: string };
    if (channel) client.join(channel);
    this.log.debug(`socket ${client.id} → ${channel || "no channel"}`);
  }

  @SubscribeMessage("subscribe")
  subscribe(client: Socket, channel: string) {
    client.join(channel);
    return { joined: channel };
  }

  private emit(channel: string, event: string, payload: any) {
    this.server?.to(channel).emit(event, payload);
  }

  emitAttendance(sessionId: string, payload: { present: number; flagged: number; token?: string }) {
    this.emit(`attendance:session:${sessionId}`, "attendance:tick", payload);
  }

  emitBus(routeId: string, payload: { lat: number; lng: number; etaMinutes: number }) {
    this.emit(`bus:${routeId}`, "bus:position", payload);
  }

  emitNotify(userId: string, payload: { title: string; body: string; at?: string }) {
    this.emit(`notify:user:${userId}`, "notify:new", { at: new Date().toISOString(), ...payload });
  }

  emitJobProgress(jobId: string, progress: number, state: "queued" | "running" | "done" | "failed") {
    this.emit(`timetable:job:${jobId}`, "job:progress", { jobId, progress, state });
  }
}
