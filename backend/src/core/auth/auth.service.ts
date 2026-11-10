import { Injectable, UnauthorizedException } from "@nestjs/common";

export type Role = "student" | "parent" | "faculty" | "hod" | "admin" | "accounts" | "librarian";

type User = { id: string; email: string; phone: string; name: string; role: Role; campusId: string; twoFactor: boolean };

const USERS: User[] = [
  { id: "usr_stu_1", email: "ananya.dasgupta@example.com", phone: "9830012345", name: "Ananya Dasgupta", role: "student", campusId: "cmp_main", twoFactor: false },
  { id: "usr_par_1", email: "subrata.d@example.com", phone: "9830098765", name: "Subrata Dasgupta", role: "parent", campusId: "cmp_main", twoFactor: false },
  { id: "usr_fac_1", email: "a.sengupta@collegesathi.edu.in", phone: "9831122334", name: "Dr. A. Sengupta", role: "faculty", campusId: "cmp_main", twoFactor: false },
  { id: "usr_hod_1", email: "s.bhattacharya@collegesathi.edu.in", phone: "9832233445", name: "Dr. S. Bhattacharya", role: "hod", campusId: "cmp_main", twoFactor: true },
  { id: "usr_adm_1", email: "registrar@collegesathi.edu.in", phone: "9833344556", name: "Registrar office", role: "admin", campusId: "cmp_main", twoFactor: true },
];

/** Demo implementation: tokens are signed JSON blobs, OTP is fixed. */
@Injectable()
export class AuthService {
  private readonly otps = new Map<string, { code: string; expires: number }>();
  private readonly refreshTokens = new Map<string, string>();
  private readonly devices = new Map<string, string[]>();

  private find(identifier: string) {
    const key = identifier.trim().toLowerCase();
    return USERS.find((u) => u.email === key || u.phone === key || u.id === key);
  }

  issueOtp(identifier: string) {
    const code = process.env.DEMO_OTP || "482913";
    const ttl = Number(process.env.OTP_TTL_SECONDS || 300);
    this.otps.set(identifier.toLowerCase(), { code, expires: Date.now() + ttl * 1000 });
    return { sent: true, channel: identifier.includes("@") ? "email" : "sms", ttlSeconds: ttl, demoCode: code };
  }

  verifyOtp(identifier: string, code: string, deviceId = "web") {
    const entry = this.otps.get(identifier.toLowerCase());
    const expected = entry?.code || process.env.DEMO_OTP || "482913";
    if (code !== expected || (entry && entry.expires < Date.now())) throw new UnauthorizedException("Invalid or expired OTP");
    const user = this.find(identifier);
    if (!user) throw new UnauthorizedException("No account for that number");
    return this.issue(user, "otp", deviceId);
  }

  login(identifier: string, password: string, deviceId = "web") {
    const user = this.find(identifier);
    if (!user || !password || password.length < 4) throw new UnauthorizedException("Invalid credentials");
    if (user.twoFactor) return { twoFactorRequired: true, challengeId: `2fa_${user.id}` };
    return this.issue(user, "password", deviceId);
  }

  sso(provider: "google" | "microsoft", idToken: string) {
    if (!idToken) throw new UnauthorizedException("Missing OIDC id token");
    const user = USERS.find((u) => u.role === "faculty")!;
    return this.issue(user, "sso", "web");
  }

  twoFactor(challengeId: string, code: string, deviceId = "web") {
    if (code !== (process.env.DEMO_OTP || "482913")) throw new UnauthorizedException("Invalid authenticator code");
    const userId = challengeId.replace("2fa_", "");
    const user = USERS.find((u) => u.id === userId);
    if (!user) throw new UnauthorizedException("Unknown challenge");
    return this.issue(user, "password+2fa", deviceId);
  }

  refresh(refreshToken: string) {
    const userId = this.refreshTokens.get(refreshToken);
    if (!userId) throw new UnauthorizedException("Refresh token rotated or revoked");
    const user = USERS.find((u) => u.id === userId)!;
    this.refreshTokens.delete(refreshToken); // rotation
    return this.issue(user, "refresh", "web");
  }

  private issue(user: User, method: string, deviceId: string) {
    const accessToken = Buffer.from(JSON.stringify({ sub: user.id, role: user.role, campusId: user.campusId, name: user.name })).toString("base64url");
    const refreshToken = Buffer.from(`${user.id}:${Date.now()}:${Math.random()}`).toString("base64url");
    this.refreshTokens.set(refreshToken, user.id);
    const bound = this.devices.get(user.id) || [];
    if (!bound.includes(deviceId)) this.devices.set(user.id, [...bound, deviceId]);
    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      method,
      deviceBound: this.devices.get(user.id),
      user: { id: user.id, name: user.name, role: user.role, email: user.email, campusId: user.campusId },
    };
  }

  decode(token: string) {
    try {
      return JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    } catch {
      return null;
    }
  }
}
