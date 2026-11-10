import { Global, Module } from "@nestjs/common";
import { TenantService, TenancyMiddleware } from "./tenancy.middleware";

@Global()
@Module({ providers: [TenancyMiddleware, TenantService], exports: [TenancyMiddleware, TenantService] })
export class TenancyModule {}
