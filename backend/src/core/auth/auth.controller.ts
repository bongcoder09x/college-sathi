import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /** POST /api/auth/login — password login, returns 2FA challenge for admin roles. */
  @Post("login")
  login(@Body() body: { identifier: string; password: string; deviceId?: string }) {
    return this.auth.login(body.identifier, body.password, body.deviceId);
  }

  /** POST /api/auth/otp — send an OTP to a mobile or email (parents, students). */
  @Post("otp")
  otp(@Body() body: { identifier: string }) {
    return this.auth.issueOtp(body.identifier);
  }

  /** POST /api/auth/otp/verify */
  @Post("otp/verify")
  verify(@Body() body: { identifier: string; code: string; deviceId?: string }) {
    return this.auth.verifyOtp(body.identifier, body.code, body.deviceId);
  }

  /** POST /api/auth/sso — OIDC exchange (Google Workspace / Microsoft). */
  @Post("sso")
  sso(@Body() body: { provider: "google" | "microsoft"; idToken: string }) {
    return this.auth.sso(body.provider, body.idToken);
  }

  /** POST /api/auth/2fa */
  @Post("2fa")
  twoFactor(@Body() body: { challengeId: string; code: string; deviceId?: string }) {
    return this.auth.twoFactor(body.challengeId, body.code, body.deviceId);
  }

  /** POST /api/auth/refresh — rotating refresh tokens. */
  @Post("refresh")
  refresh(@Body() body: { refreshToken: string }) {
    return this.auth.refresh(body.refreshToken);
  }

  /** GET-like helper exposed as POST so the demo client can read its own claims. */
  @Post("me")
  me(@Req() req: any) {
    const header = String(req.headers.authorization || "");
    return this.auth.decode(header.replace("Bearer ", "")) || null;
  }
}
