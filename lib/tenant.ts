import { cookies, headers } from "next/headers";
import { campuses } from "./data";
import { CAMPUS_COOKIE } from "./constants";

export { CAMPUS_COOKIE };

export type Tenant = {
  slug: string;
  shortName: string;
  host: string;
  subdomain: string | null;
  resolvedFrom: "subdomain" | "cookie" | "default";
};

/**
 * Tenant resolution: <campus>.collegesathi.edu.in wins, then the campus cookie
 * set by the switcher, then the Main Campus.
 */
export function resolveTenant(hostHeader: string | null, cookieSlug?: string): Tenant {
  const host = (hostHeader || "localhost:3000").split(":")[0];
  const parts = host.split(".");
  const isLocal = host === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(host);
  const candidate = !isLocal && parts.length > 2 ? parts[0] : null;
  const bySubdomain = candidate ? campuses.find((c) => c.slug === candidate) : undefined;
  const byCookie = cookieSlug ? campuses.find((c) => c.slug === cookieSlug) : undefined;
  const chosen = bySubdomain || byCookie || campuses[0];
  return {
    slug: chosen.slug,
    shortName: chosen.shortName,
    host,
    subdomain: candidate,
    resolvedFrom: bySubdomain ? "subdomain" : byCookie ? "cookie" : "default",
  };
}

export function currentTenant(): Tenant {
  const h = headers();
  const c = cookies();
  return resolveTenant(h.get("host"), c.get(CAMPUS_COOKIE)?.value);
}
