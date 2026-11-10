import { Body, Controller, Get, Module, Param, Patch } from "@nestjs/common";

type Campus = { id: string; slug: string; name: string; city: string; groupId: string; academicYear: string; holidays: string[] };

const CAMPUSES: Campus[] = [
  { id: "cmp_main", slug: "main", name: "Main Campus", city: "Kolkata", groupId: "grp_collegesathi", academicYear: "2026-27", holidays: ["2026-10-02", "2026-10-20"] },
  { id: "cmp_north", slug: "north", name: "North Campus", city: "Siliguri", groupId: "grp_collegesathi", academicYear: "2026-27", holidays: ["2026-10-02"] },
  { id: "cmp_south", slug: "south", name: "South Campus", city: "Kolkata", groupId: "grp_collegesathi", academicYear: "2026-27", holidays: [] },
  { id: "cmp_poly", slug: "polytechnic", name: "Polytechnic Campus", city: "Kalyani", groupId: "grp_collegesathi", academicYear: "2026-27", holidays: [] },
];

@Controller("campus")
export class CampusController {
  /** GET /api/campus — campuses for the resolved group. */
  @Get()
  list() {
    return { campuses: CAMPUSES };
  }

  /** PATCH /api/campus/:id — branding, academic year, holidays. */
  @Patch(":id")
  update(@Param("id") id: string, @Body() body: Partial<Campus>) {
    const campus = CAMPUSES.find((c) => c.id === id || c.slug === id);
    if (!campus) return { updated: false };
    Object.assign(campus, body);
    return { updated: true, campus };
  }
}

@Module({ controllers: [CampusController] })
export class CampusModule {}
