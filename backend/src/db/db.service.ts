import { Injectable, Logger } from "@nestjs/common";
import { Pool } from "pg";

export type TenantContext = { groupId: string; campusId: string | null; userId: string | null; role: string | null };

/**
 * Single database entry point.
 * With DATABASE_URL set it uses Postgres and sets the RLS session variables on
 * every connection checkout; without it the service runs in demo mode and the
 * domain modules fall back to in-memory fixtures.
 */
@Injectable()
export class DbService {
  private readonly log = new Logger(DbService.name);
  private pool: Pool | null = null;

  constructor() {
    if (process.env.DATABASE_URL) {
      this.pool = new Pool({ connectionString: process.env.DATABASE_URL, max: Number(process.env.PG_POOL_MAX || 10) });
      this.log.log("Postgres pool created");
    } else {
      this.log.warn("DATABASE_URL not set — running in in-memory demo mode");
    }
  }

  get live() {
    return Boolean(this.pool);
  }

  /** Runs a query inside a transaction with RLS session variables applied. */
  async withTenant<T>(ctx: TenantContext, fn: (q: (sql: string, params?: any[]) => Promise<any>) => Promise<T>): Promise<T> {
    if (!this.pool) return fn(async () => ({ rows: [], rowCount: 0 }));
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT set_config('app.group_id', $1, true), set_config('app.campus_id', $2, true), set_config('app.user_id', $3, true), set_config('app.role', $4, true)", [
        ctx.groupId || "",
        ctx.campusId || "",
        ctx.userId || "",
        ctx.role || "",
      ]);
      const result = await fn(async (sql, params) => client.query(sql, params));
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
