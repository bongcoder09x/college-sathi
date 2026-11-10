import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export type Role = "student" | "parent" | "faculty" | "hod" | "admin" | "accounts" | "librarian";
export type Scope = "group" | "campus" | "dept" | "self";

export const ROLES_KEY = "sathi:roles";
export const SCOPE_KEY = "sathi:scope";

/** @Roles("faculty", "hod") on a handler or controller. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
/** @Scope("campus") limits the handler to the caller's campus. */
export const ScopeOf = (scope: Scope) => SetMetadata(SCOPE_KEY, scope);

/** Permission matrix: role → allowed module prefixes. */
export const PERMISSIONS: Record<Role, string[]> = {
  student: ["lms", "exams", "fees", "library", "hostel", "transport", "helpdesk", "attendance:read"],
  parent: ["parents", "fees", "transport", "communication"],
  faculty: ["attendance", "lms", "exams", "timetable:read", "students:read"],
  hod: ["timetable", "attendance", "exams", "reports", "structure"],
  admin: ["*"],
  accounts: ["fees", "payments", "reports"],
  librarian: ["library"],
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!roles?.length) return true;
    const req = context.switchToHttp().getRequest();
    const role = req.user?.role as Role | undefined;
    if (!role || !roles.includes(role)) throw new ForbiddenException(`Requires role: ${roles.join(", ")}`);
    const moduleKey = String(req.route?.path || req.path || "").split("/").filter(Boolean)[0];
    const allowed = PERMISSIONS[role] || [];
    if (!allowed.includes("*") && !allowed.some((p) => moduleKey.startsWith(p.split(":")[0]))) {
      throw new ForbiddenException(`Role ${role} cannot access ${moduleKey}`);
    }
    return true;
  }
}
