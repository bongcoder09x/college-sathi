import { Body, Controller, Get, Module, Param, Post } from "@nestjs/common";

const FACULTY = [
  { id: "usr_fac_1", code: "FAC-114", name: "Dr. A. Sengupta", deptId: "dept_cse", designation: "Associate Professor", workloadHours: 16, maxHours: 20, qualifications: ["PhD (IIT KGP)"] },
  { id: "usr_fac_2", code: "FAC-121", name: "Prof. R. Mitra", deptId: "dept_cse", designation: "Assistant Professor", workloadHours: 18, maxHours: 20, qualifications: ["M.Tech"] },
];

@Controller("faculty")
export class FacultyController {
  /** GET /api/faculty?deptId=dept_cse */
  @Get()
  list() {
    return { faculty: FACULTY };
  }

  /** POST /api/faculty/:id/leave — staff leave application. */
  @Post(":id/leave")
  leave(@Param("id") id: string, @Body() body: { from: string; to: string; type: string }) {
    return { id: `SL-${Math.floor(Math.random() * 900) + 100}`, facultyId: id, ...body, status: "Pending" };
  }

  /** GET /api/faculty/:id/payslips */
  @Get(":id/payslips")
  payslips(@Param("id") id: string) {
    return {
      facultyId: id,
      payslips: [
        { month: "2026-10", gross: 118000, net: 104400, job: "pdf.render", status: "available" },
        { month: "2026-09", gross: 118000, net: 104400, job: "pdf.render", status: "available" },
      ],
    };
  }
}

@Module({ controllers: [FacultyController] })
export class FacultyModule {}
