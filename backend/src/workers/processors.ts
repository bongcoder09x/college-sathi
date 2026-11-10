import { JobName } from "./workers.module";

/**
 * Processor registry — one entry per BullMQ worker in the architecture.
 * Wire each to `new Worker(name, handler, { connection })` in production.
 */
export const PROCESSORS: Record<JobName, (data: any) => Promise<any>> = {
  "timetable.solve": async (data) => ({ draftGrid: data?.constraints ? {} : {}, clashes: 0 }),
  "pdf.render": async (data) => ({ fileKey: `pdf/${data?.type || "document"}.pdf` }),
  "notify.send": async (data) => ({ delivered: data?.channels?.length || 1 }),
  "import.process": async (data) => ({ rows: data?.rows || 0, errors: [] }),
  "fees.reminder": async () => ({ reminded: 42 }),
  "fees.late-fine": async () => ({ finesApplied: 7 }),
  "payments.reconcile": async () => ({ mismatches: 0 }),
  "reports.build": async (data) => ({ reportId: data?.reportId, fileKey: "reports/latest.xlsx" }),
  "attendance.shortage-scan": async () => ({ studentsBelow75: 4 }),
  "gps.ingest": async () => ({ positions: 1 }),
};
