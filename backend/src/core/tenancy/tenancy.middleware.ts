import { Injectable, NestMiddleware } from "@nestjs/common";

export type ResolvedTenant = {
  groupSlug: string;
  groupId: string;
  campusSlug: string | null;
  campusId: string | null;
  host: string;
  resolvedFrom: "host" | "header" | "default";
};

/**
 * Resolves the group (institution) and campus for every request.
 * Order: x-campus / x-group headers (API clients) → subdomain of the host
 * (main.collegesathi.edu.in) → default campus. The result is attached to the
 * request and used by DbService to set the RLS session variables.
 */
@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    const host = String(req.headers["host"] || "localhost").split(":")[0];
    const parts = host.split(".");
    const sub = parts.length > 2 && !/^\d+$/.test(parts[0]) ? parts[0] : null;
    const headerCampus = (req.headers["x-campus"] as string) || null;
    const headerGroup = (req.headers["x-group"] as string) || null;

    const campusSlug = headerCampus || (sub && sub !== "www" ? sub : null);
    const resolvedFrom = headerCampus ? "header" : campusSlug ? "host" : "default";

    req.tenant = {
      groupSlug: headerGroup || "collegesathi",
      groupId: `grp_${headerGroup || "collegesathi"}`,
      campusSlug: campusSlug || "main",
      campusId: `cmp_${campusSlug || "main"}`,
      host,
      resolvedFrom,
    } satisfies ResolvedTenant;

    next();
  }
}

@Injectable()
export class TenantService {
  from(req: any): ResolvedTenant {
    return (
      req?.tenant || {
        groupSlug: "collegesathi",
        groupId: "grp_collegesathi",
        campusSlug: "main",
        campusId: "cmp_main",
        host: "localhost",
        resolvedFrom: "default",
      }
    );
  }
}
