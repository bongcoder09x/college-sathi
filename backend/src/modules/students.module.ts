import { Body, Controller, Get, Module, Param, Patch, Post } from "@nestjs/common";

const STUDENTS = [
  { id: "usr_stu_1", roll: "CS2201", name: "Ananya Dasgupta", programId: "prg_btech_cse", section: "CSE-5A", campusId: "cmp_main", status: "active", guardianIds: ["usr_par_1"] },
  { id: "usr_stu_2", roll: "CS2202", name: "Ritwik Mondal", programId: "prg_btech_cse", section: "CSE-5A", campusId: "cmp_main", status: "active", guardianIds: [] },
  { id: "usr_stu_3", roll: "BBA2408", name: "Riddhi Dasgupta", programId: "prg_bba", section: "BBA-3A", campusId: "cmp_north", status: "active", guardianIds: ["usr_par_1"] },
];

@Controller("students")
export class StudentsController {
  /** GET /api/students?section=CSE-5A */
  @Get()
  list() {
    return { students: STUDENTS };
  }

  /** GET /api/students/:id */
  @Get(":id")
  one(@Param("id") id: string) {
    return { student: STUDENTS.find((s) => s.id === id || s.roll === id) || null };
  }

  /** PATCH /api/students/:id — profile update. */
  @Patch(":id")
  update(@Param("id") id: string, @Body() body: any) {
    const student = STUDENTS.find((s) => s.id === id);
    if (!student) return { updated: false };
    Object.assign(student, body);
    return { updated: true, student };
  }

  /** POST /api/students/:id/promote — semester promotion / transfer / status change. */
  @Post(":id/promote")
  promote(@Param("id") id: string, @Body() body: { toSemester?: number; toSection?: string; status?: string }) {
    return { promoted: true, studentId: id, ...body, effectiveFrom: "2027-07-01" };
  }

  /** GET /api/students/:id/id-card — queued PDF render job. */
  @Get(":id/id-card")
  idCard(@Param("id") id: string) {
    return { job: "pdf.render", type: "student-id-card", studentId: id, status: "queued", downloadUrl: null };
  }
}

@Module({ controllers: [StudentsController] })
export class StudentsModule {}
