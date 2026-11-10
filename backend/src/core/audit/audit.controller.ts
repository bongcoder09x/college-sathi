import { Controller, Get, Query } from "@nestjs/common";
import { AuditService } from "./audit.service";

@Controller("audit")
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  /** GET /api/audit?entity=admissions&limit=50 */
  @Get()
  list(@Query("entity") entity?: string, @Query("limit") limit?: string) {
    return { entries: this.audit.list(Number(limit || 100), entity) };
  }
}
