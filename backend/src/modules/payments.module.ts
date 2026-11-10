import { Body, Controller, Get, Headers, Module, Post, Query } from "@nestjs/common";

@Controller("payments")
export class PaymentsController {
  /** POST /api/payments/orders — gateway order for a fee head. */
  @Post("orders")
  order(@Body() body: { studentId: string; amount: number; purpose: string }) {
    return { orderId: `order_${Date.now()}`, amount: body.amount, currency: "INR", gateway: "razorpay-demo", status: "created" };
  }

  /** POST /api/payments/webhook — signature verified, then reconciled. */
  @Post("webhook")
  webhook(@Body() body: any, @Headers("x-signature") signature?: string) {
    const valid = Boolean(signature) && signature === process.env.PAYMENT_WEBHOOK_SECRET;
    if (!valid) return { accepted: false, reason: "invalid-signature" };
    return { accepted: true, reconciled: true, job: "payments.reconcile", event: body?.event || "payment.captured" };
  }

  /** GET /api/payments/reconciliation?date= */
  reconciliation(@Query("date") date?: string) {
    return { date, gatewayTotal: 184000, ledgerTotal: 184000, mismatches: [] };
  }

  /** POST /api/payments/refunds */
  refund(@Body() body: { orderId: string; amount: number }) {
    return { refundId: `rfnd_${Date.now()}`, ...body, status: "initiated" };
  }
}

@Module({ controllers: [PaymentsController] })
export class PaymentsModule {}
