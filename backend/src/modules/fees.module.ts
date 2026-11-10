import { Body, Controller, Get, Module, Param, Post, Query } from "@nestjs/common";

@Controller("fees")
export class FeesController {
  /** GET /api/fees/ledger?studentId= */
  @Get("ledger")
  ledger(@Query("studentId") studentId?: string) {
    return {
      studentId,
      due: 2400,
      ledger: [
        { head: "Semester 5 tuition", amount: 64000, status: "Paid", receipt: "RCPT-2026-000142" },
        { head: "Examination fee", amount: 2400, status: "Due", due: "2026-11-25" },
      ],
    };
  }

  /** POST /api/fees/invoices — fee structure → invoice. */
  @Post("invoices")
  invoice(@Body() body: { studentId: string; heads: { head: string; amount: number }[]; dueDate: string }) {
    const total = body.heads?.reduce((s, h) => s + h.amount, 0) || 0;
    return { invoiceId: `INV-${Date.now()}`, total, ...body, status: "issued" };
  }

  /** POST /api/fees/concessions */
  concession(@Body() body: { studentId: string; type: string; amount: number; reason: string }) {
    return { concessionId: `CON-${Date.now()}`, ...body, status: "Pending approval" };
  }

  /** GET /api/fees/refunds */
  refunds() {
    return { refunds: [{ id: "RF-101", studentId: "usr_stu_2", amount: 9000, status: "Processed" }] };
  }

  /** POST /api/fees/fines — late fee run is normally the fees.late-fine worker. */
  @Post("fines")
  fine(@Body() body: { studentId: string; amount: number; reason: string }) {
    return { fineId: `FN-${Date.now()}`, ...body, status: "applied" };
  }
}

@Module({ controllers: [FeesController] })
export class FeesModule {}
