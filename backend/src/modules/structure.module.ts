import { Controller, Get, Module, Query } from "@nestjs/common";

const DEPARTMENTS = [
  { id: "dept_cse", name: "Computer Science", campusId: "cmp_main" },
  { id: "dept_mgmt", name: "Management", campusId: "cmp_north" },
  { id: "dept_eng", name: "Engineering (Diploma)", campusId: "cmp_poly" },
];

const PROGRAMS = [
  { id: "prg_btech_cse", name: "B.Tech CSE", level: "UG", deptId: "dept_cse", batches: ["2022-26", "2023-27", "2024-28"] },
  { id: "prg_bba", name: "BBA", level: "UG", deptId: "dept_mgmt", batches: ["2024-27"] },
  { id: "prg_mba", name: "MBA", level: "PG", deptId: "dept_mgmt", batches: ["2025-27"] },
];

const SECTIONS = [
  { id: "CSE-5A", programId: "prg_btech_cse", semester: 5, strength: 58, mentorId: "usr_fac_1" },
  { id: "CSE-5B", programId: "prg_btech_cse", semester: 5, strength: 56, mentorId: "usr_fac_1" },
];

const SUBJECTS = [
  { code: "CSE501", title: "Machine Learning", credits: 4, semester: 5, deptId: "dept_cse" },
  { code: "CSE502", title: "Compiler Design", credits: 3, semester: 5, deptId: "dept_cse" },
  { code: "CSE505", title: "Capstone Studio", credits: 2, semester: 5, deptId: "dept_cse" },
];

@Controller("structure")
export class StructureController {
  /** GET /api/structure?kind=departments|programs|sections|subjects */
  @Get()
  list(@Query("kind") kind = "departments") {
    const map: Record<string, any> = { departments: DEPARTMENTS, programs: PROGRAMS, sections: SECTIONS, subjects: SUBJECTS };
    return { kind, items: map[kind] || [] };
  }
}

@Module({ controllers: [StructureController] })
export class StructureModule {}
