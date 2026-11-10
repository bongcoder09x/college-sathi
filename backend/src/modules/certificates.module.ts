import { Body, Controller, Get, Module, Param, Post } from "@nestjs/common";

const CERTS = new Map<string, any>([
  ["CS-CERT-2024-001", { id: "CS-CERT-2024-001", holder: "Ananya Dasgupta", type: "Degree Certificate", status: "valid", issuedOn: "2026-07-15" }],
  ["CS-CERT-2023-119", { id: "CS-CERT-2023-119", holder: "Sohini Roy", type: "Consolidated Marksheet", status: "revoked", issuedOn: "2026-05-11" }],
]);

@Controller("certificates")
export class CertificatesController {
  /** POST /api/certificates/issue — template + data → queued PDF + QR. */
  @Post("issue")
  issue(@Body() body: { studentId: string; type: string }) {
    const id = `CS-CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`;
    CERTS.set(id, { id, holder: body.studentId, type: body.type, status: "valid", issuedOn: new Date().toISOString().slice(0, 10) });
    return { certificateId: id, job: "pdf.render", qrPayload: `https://collegesathi.edu.in/verify/${id}` };
  }

  /** GET /api/certificates/verify/:id — public verification. */
  @Get("verify/:id")
  verify(@Param("id") id: string) {
    const record = CERTS.get(id);
    return record ? { found: true, record } : { found: false };
  }

  /** POST /api/certificates/:id/digilocker — push to DigiLocker. */
  @Post(":id/digilocker")
  digilocker(@Param("id") id: string) {
    return { certificateId: id, pushed: true, provider: "digilocker", status: "accepted" };
  }
}

@Module({ controllers: [CertificatesController] })
export class CertificatesModule {}
