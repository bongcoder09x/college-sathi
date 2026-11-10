import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { AuditService } from "./audit.service";

/** Writes who/what/when (+ before/after when the handler returns a diff) for every mutation. */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly audit: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    if (method === "GET" || method === "HEAD") return next.handle();

    return next.handle().pipe(
      tap((result) => {
        this.audit.record({
          who: req.user?.sub || req.user?.name || "anonymous",
          role: req.user?.role || null,
          what: `${method} ${req.originalUrl || req.url}`,
          entity: String(req.originalUrl || req.url).split("/").filter(Boolean)[1] || "unknown",
          before: req.body?.before,
          after: result?.after ?? undefined,
          ip: req.ip,
          campusId: req.tenant?.campusId || null,
        });
      })
    );
  }
}
