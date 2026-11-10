import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Channel, NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  /** GET /api/notifications/templates */
  @Get("templates")
  templates() {
    return { templates: this.notifications.templates() };
  }

  /** POST /api/notifications/preferences */
  @Post("preferences")
  preference(@Body() body: { userId: string; channels: Channel[] }) {
    return this.notifications.setPreference(body.userId, body.channels);
  }

  /** POST /api/notifications/send */
  @Post("send")
  send(@Body() body: { userId: string; template: string; data?: Record<string, string>; channels?: Channel[] }) {
    return this.notifications.send(body);
  }

  /** GET /api/notifications/outbox?userId= */
  @Get("outbox")
  outbox(@Query("userId") userId?: string) {
    return { messages: this.notifications.outboxList(userId) };
  }
}
