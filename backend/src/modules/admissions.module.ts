import { Body, Controller, Get, Module, Param, Patch, Post, Query } from "@nestjs/common";

type Application = {
  id: string;
  applicant: { name: string; email: string; phone: string };
  preferences: { programId: string; campusId: string }[];
  status: "draft" | "submitted" | "verified" | "merit" | "offered" | "enrolled" | "rejected";
  feePaid: boolean;
  documentsVerified: number;
};

const APPLICATIONS: Application[] = [
  { id: "CS-APP-1042", applicant: { name: "Ananya Dasgupta", email: "ananya.dasgupta@example.com", phone: "9830012345" }, preferences: [{ programId: "prg_btech_cse", campusId: "cmp_main" }], status: "verified", feePaid: true, documentsVerified: 4 },
  { id: "CS-APP-1078", applicant: { name: "Ritwik Mondal", email: "ritwik.mondal@example.com", phone: "9831122334" }, preferences: [{ programId: "prg_bba", campusId: "cmp_north" }], status: "merit", feePaid: true, documentsVerified: 4 },
];

@Controller("admissions")
export class AdmissionsController {
  /** GET /api/admissions/applications?status=verified */
  @Get("applications")
  list(@Query("status") status?: string) {
    return { applications: APPLICATIONS.filter((a) => (status ? a.status === status : true)) };
  }

  /** POST /api/admissions/enquiries — public contact form → CRM lead. */
  @Post("enquiries")
  enquiry(@Body() body: { name: string; phone: string; message: string; programId?: string }) {
    return { leadId: `ENQ-${Math.floor(Math.random() * 9000) + 1000}`, stage: "New", ...body, at: new Date().toISOString() };
  }

  /** POST /api/admissions/applications — create a draft (7-step wizard). */
  @Post("applications")
  create(@Body() body: { email?: string; phone?: string }) {
    const app: Application = {
      id: `CS-APP-${Math.floor(Math.random() * 9000) + 1000}`,
      applicant: { name: "", email: body.email || "", phone: body.phone || "" },
      preferences: [],
      status: "draft",
      feePaid: false,
      documentsVerified: 0,
    };
    APPLICATIONS.push(app);
    return { application: app, nextStep: 1 };
  }

  /** PATCH /api/admissions/applications/:id — autosave from the wizard. */
  @Patch("applications/:id")
  update(@Param("id") id: string, @Body() body: Partial<Application>) {
    const app = APPLICATIONS.find((a) => a.id === id);
    if (!app) return { updated: false };
    Object.assign(app, body);
    return { updated: true, application: app };
  }

  /** POST /api/admissions/applications/:id/verify — documents verified by the cell. */
  @Post("applications/:id/verify")
  verify(@Param("id") id: string) {
    const app = APPLICATIONS.find((a) => a.id === id);
    if (!app) return { verified: false };
    app.status = "verified";
    app.documentsVerified = 4;
    return { verified: true, application: app };
  }

  /** GET /api/admissions/merit-list?programId= */
  @Get("merit-list")
  merit(@Query("programId") programId?: string) {
    const ranked = APPLICATIONS.filter((a) => a.status !== "draft").map((a, i) => ({
      rank: i + 1,
      applicationId: a.id,
      name: a.applicant.name,
      programId: programId || a.preferences[0]?.programId,
      campusId: a.preferences[0]?.campusId,
      score: 88 - i * 2.5,
    }));
    return { programId, merit: ranked };
  }

  /** POST /api/admissions/applications/:id/offer */
  @Post("applications/:id/offer")
  offer(@Param("id") id: string, @Body() body: { programId?: string; campusId?: string }) {
    const app = APPLICATIONS.find((a) => a.id === id);
    if (!app) return { offered: false };
    app.status = "offered";
    return { offered: true, offerId: `OFF-${id}`, acceptBy: new Date(Date.now() + 14 * 86400000).toISOString(), ...body };
  }
}

@Module({ controllers: [AdmissionsController] })
export class AdmissionsModule {}
