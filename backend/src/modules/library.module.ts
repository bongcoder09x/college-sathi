import { Body, Controller, Get, Module, Param, Post, Query } from "@nestjs/common";

@Controller("library")
export class LibraryController {
  /** GET /api/library/catalogue?q= */
  @Get("catalogue")
  catalogue(@Query("q") q?: string) {
    const items = [
      { isbn: "978-0262035613", title: "Deep Learning", author: "Goodfellow et al.", available: 2 },
      { isbn: "978-1449373320", title: "Designing Data-Intensive Applications", author: "Kleppmann", available: 1 },
    ];
    return { items: q ? items.filter((i) => (i.title + i.author).toLowerCase().includes(q.toLowerCase())) : items };
  }

  /** POST /api/library/loans — issue a copy. */
  @Post("loans")
  issue(@Body() body: { isbn: string; memberId: string }) {
    return { loanId: `LN-${Date.now()}`, due: "2026-12-01", ...body, finePerDay: 2 };
  }

  /** POST /api/library/loans/:id/return */
  return(@Param("id") id: string) {
    return { loanId: id, returned: true, fine: 0 };
  }

  /** POST /api/library/reservations */
  reserve(@Body() body: { isbn: string; memberId: string }) {
    return { reservationId: `RS-${Date.now()}`, status: "Reserved", ...body };
  }
}

@Module({ controllers: [LibraryController] })
export class LibraryModule {}
