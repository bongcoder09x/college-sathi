import { Injectable } from "@nestjs/common";

export type AuditEntry = {
  id: string;
  at: string;
  who: string;
  role: string | null;
  what: string;
  entity: string;
  before?: any;
  after?: any;
  ip?: string;
  campusId?: string | null;
};

/** Append-only audit trail. Swap the array for the `audit_log` table in production. */
@Injectable()
export class AuditService {
  private readonly entries: AuditEntry[] = [];

  record(entry: Omit<AuditEntry, "id" | "at">) {
    const row: AuditEntry = { id: `aud_${this.entries.length + 1}`, at: new Date().toISOString(), ...entry };
    this.entries.unshift(row);
    if (this.entries.length > 5000) this.entries.pop();
    return row;
  }

  list(limit = 100, entity?: string) {
    return this.entries.filter((e) => (entity ? e.entity === entity : true)).slice(0, limit);
  }
}
