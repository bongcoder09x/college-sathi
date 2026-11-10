import type { Metadata } from "next";
import ProgramFilters from "@/components/ProgramFilters";
import { programs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Programmes & fees",
  description:
    "Filter 44 undergraduate, postgraduate and diploma programmes by campus, level, department and mode. Compare fees, duration and seats.",
};

export default function ProgramsPage() {
  return (
    <div className="shell py-12">
      <p className="eyebrow">Programme catalogue · Autumn 2026</p>
      <h1 className="h1 mt-2 max-w-3xl text-ink">Find the programme, then the campus</h1>
      <p className="muted mt-3 max-w-2xl">
        Eleven flagship programmes are shown in full detail in this demo build — fees, seats, eligibility and syllabus
        come straight from the catalogue. Filter by campus, level, department or mode of study.
      </p>

      <div className="mt-8">
        <ProgramFilters programs={programs} />
      </div>
    </div>
  );
}
