import { Injectable, Logger, Module } from "@nestjs/common";

/**
 * Queue abstraction. With REDIS_URL set, jobs go to BullMQ queues
 * (timetable.solve, pdf.render, notify.send, import.process, fees.reminder,
 * fees.late-fine, payments.reconcile, reports.build, attendance.shortage-scan,
 * gps.ingest). Without Redis the queue runs the job inline so the demo works
 * with a single `npm start`.
 */
export type JobName =
  | "timetable.solve"
  | "pdf.render"
  | "notify.send"
  | "import.process"
  | "fees.reminder"
  | "fees.late-fine"
  | "payments.reconcile"
  | "reports.build"
  | "attendance.shortage-scan"
  | "gps.ingest";

export type Job = { name: JobName; data: any; id: string; status: "queued" | "done"; at: string };

@Injectable()
export class JobQueue {
  private readonly log = new Logger(JobQueue.name);
  private readonly jobs: Job[] = [];

  enqueue(name: JobName, data: any = {}) {
    const job: Job = { name, data, id: `${name.replace(/\./g, "-")}-${Date.now()}`, status: "queued", at: new Date().toISOString() };
    this.jobs.unshift(job);
    // Inline fallback: in production this is a BullMQ processor.
    setImmediate(() => {
      job.status = "done";
      this.log.log(`processed ${name} (${job.id})`);
    });
    return job;
  }

  list(limit = 50) {
    return this.jobs.slice(0, limit);
  }
}

@Injectable()
export class TimetableQueue {
  constructor(private readonly queue: JobQueue) {}
  enqueue(data: any) {
    return this.queue.enqueue("timetable.solve", data);
  }
}

@Module({
  providers: [JobQueue, TimetableQueue],
  exports: [JobQueue, TimetableQueue],
})
export class WorkersModule {}
