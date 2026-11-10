import { Body, Controller, Get, Module, Post } from "@nestjs/common";

@Controller("communication")
export class CommunicationController {
  /** POST /api/communication/announcements — audience resolution + delivery. */
  @Post("announcements")
  announce(@Body() body: { title: string; body: string; audience: { campusId?: string; section?: string; role?: string } }) {
    return { announcementId: `AN-${Date.now()}`, deliveredTo: 486, channels: ["inapp", "email"], ...body };
  }

  /** GET /api/communication/threads */
  @Get("threads")
  threads() {
    return {
      threads: [
        { id: "th_1", with: "Dr. A. Sengupta", last: "Sprint review went well", unread: 0 },
        { id: "th_2", with: "Accounts office", last: "Examination fee due 25 Nov", unread: 1 },
      ],
    };
  }

  /** POST /api/communication/circulars */
  @Post("circulars")
  circular(@Body() body: { title: string; fileKey: string; audience: string }) {
    return { circularId: `CR-${Date.now()}`, status: "published", ...body };
  }
}

@Module({ controllers: [CommunicationController] })
export class CommunicationModule {}
