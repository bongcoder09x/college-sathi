import { Global, Module } from "@nestjs/common";
import { PermissionsGuard, Roles } from "./permissions.guard";

@Global()
@Module({ providers: [PermissionsGuard], exports: [PermissionsGuard] })
export class IamModule {}

export { Roles };
