import type { Metadata } from "next";
import ResultLookup from "@/components/ResultLookup";

export const metadata: Metadata = {
  title: "Result lookup",
  description: "Check your semester result with your roll number and date of birth.",
};

export default function ResultsPage() {
  return (
    <div className="shell py-12">
      <p className="eyebrow">Examination branch</p>
      <h1 className="h1 mt-2 text-ink">Check your result</h1>
      <p className="muted mt-3 max-w-2xl">
        Semester 4 results for B.Tech and BCA are published. You need your roll number, date of birth and the security
        code shown on this page.
      </p>
      <div className="mt-8">
        <ResultLookup />
      </div>
    </div>
  );
}
