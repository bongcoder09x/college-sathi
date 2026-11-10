"use client";

import Link from "next/link";
import PortalShell, { studentNav } from "@/components/PortalShell";
import { courses } from "@/lib/portal";

export default function CoursesPage() {
  return (
    <PortalShell title="Courses" subtitle="LMS-lite · materials, assignments and quizzes" groups={studentNav}>
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((c) => (
          <Link key={c.slug} href={`/student/courses/${c.slug}`} className="card card-hover overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${c.color}`} />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="badge-slate">{c.code}</span>
                <span className="text-[11px] text-slate-500">{c.credits} credits</span>
              </div>
              <p className="mt-2 font-display text-xl leading-snug text-ink">{c.title}</p>
              <p className="text-[11.5px] text-slate-500">{c.faculty}</p>
              <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-slate-600">{c.description}</p>
              <div className="mt-3">
                <div className="flex justify-between text-[10.5px] text-slate-500">
                  <span>Course progress</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-beige/70">
                  <div className={`h-full rounded-full bg-gradient-to-r ${c.color}`} style={{ width: `${c.progress}%` }} />
                </div>
              </div>
              <div className="mt-3 flex gap-3 text-[11px] text-slate-500">
                <span>{c.assignments.filter((a) => a.status === "Open").length} open task(s)</span>
                <span>{c.quizzes.length} quiz(zes)</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}
