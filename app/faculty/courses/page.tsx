"use client";

import { useState } from "react";
import PortalShell, { facultyNav } from "@/components/PortalShell";
import { faculty, facultyCourses } from "@/lib/portals";

export default function FacultyCoursesPage() {
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [quiz, setQuiz] = useState({ title: "", questions: "5", duration: "20" });
  const [msg, setMsg] = useState("");

  return (
    <PortalShell
      title="Courses"
      subtitle="Materials, assignments, quiz builder and grading queue"
      groups={facultyNav}
      person={{ name: faculty.name, sub: `${faculty.code} · Faculty` }}
    >
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          {facultyCourses.map((c) => (
            <div key={c.code} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg">{c.title}</p>
                  <p className="text-[11px] text-slate-500">{c.code} · {c.sections.join(", ")}</p>
                </div>
                <span className="badge-amber">{c.pendingGrading} to grade</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <label className="btn-outline btn-sm cursor-pointer">
                  Upload material
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setUploaded((u) => [f.name, ...u]);
                    }}
                  />
                </label>
                <button className="btn-ghost btn-sm">New assignment</button>
                <button className="btn-ghost btn-sm">Grading queue ({c.pendingGrading})</button>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">{c.materials} materials published this semester.</p>
            </div>
          ))}

          {uploaded.length ? (
            <div className="card border-brand-300 bg-brand-50/40 p-4">
              <p className="text-[12px] font-semibold text-ink">Uploaded in this session</p>
              <ul className="mt-1 space-y-1 text-[11.5px] text-slate-600">
                {uploaded.map((u) => (
                  <li key={u}>• {u}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Quiz builder</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!quiz.title) return setMsg("Give the quiz a title.");
                setMsg(`Draft created: ${quiz.title} · ${quiz.questions} questions · ${quiz.duration} minutes.`);
              }}
              className="mt-3 space-y-2"
            >
              <input className="input" placeholder="Quiz title" value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="input" type="number" value={quiz.questions} onChange={(e) => setQuiz({ ...quiz, questions: e.target.value })} placeholder="Questions" />
                <input className="input" type="number" value={quiz.duration} onChange={(e) => setQuiz({ ...quiz, duration: e.target.value })} placeholder="Minutes" />
              </div>
              <button className="btn-primary btn-sm w-full">Create draft</button>
              {msg ? <p className="text-[11px] text-brand-700">{msg}</p> : null}
            </form>
            <p className="mt-2 text-[10.5px] text-slate-500">Auto-grading and shuffling are enabled by default.</p>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Grading queue</p>
            <ul className="mt-2 space-y-1.5 text-[11.5px]">
              {[
                ["CSE501 · Assignment 4", "12 pending"],
                ["CSE501 · Quiz 3", "0 pending"],
                ["CSE505 · Sprint 4 demo", "3 pending"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between">
                  <span className="truncate text-slate-600">{k}</span>
                  <span className="badge-amber shrink-0">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
