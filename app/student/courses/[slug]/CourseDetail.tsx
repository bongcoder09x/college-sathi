"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PortalShell, { studentNav } from "@/components/PortalShell";
import { courses } from "@/lib/portal";
import { saveAttempt, submitAssignment, usePortalStore } from "@/lib/portalStore";

const quizBank = [
  { q: "Which ensemble method reduces variance by averaging deep trees?", options: ["Bagging", "AdaBoost", "PCA", "k-means"], answer: 0 },
  { q: "A random forest differs from bagging mainly by…", options: ["More trees", "Feature subsampling at splits", "Using gradients", "Bootstrapping rows only"], answer: 1 },
  { q: "Gradient boosting fits each new tree to…", options: ["The raw target", "Residual errors", "The class labels", "Random noise"], answer: 1 },
  { q: "Which metric is least sensitive to class imbalance?", options: ["Accuracy", "F1 score", "ROC-AUC", "Macro F1"], answer: 0 },
  { q: "Stacking combines base models using…", options: ["A meta-model", "Simple voting only", "One feature", "Random weights"], answer: 0 },
];

export default function CourseDetail({ slug }: { slug: string }) {
  const course = courses.find((c) => c.slug === slug);
  const store = usePortalStore();
  const [quizOpen, setQuizOpen] = useState(false);
  const [answers, setAnswers] = useState<number[]>(Array(quizBank.length).fill(-1));
  const [seconds, setSeconds] = useState(20 * 60);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [uploaded, setUploaded] = useState<string | null>(null);

  useEffect(() => {
    if (!quizOpen || result) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [quizOpen, result]);

  if (!course) {
    return (
      <PortalShell title="Course not found" groups={studentNav}>
        <div className="card p-8 text-center">
          <p className="muted">That course is not in your semester.</p>
          <Link href="/student/courses" className="btn-primary btn-sm mt-4">Back to courses</Link>
        </div>
      </PortalShell>
    );
  }

  const finishQuiz = () => {
    const score = answers.reduce((s, a, i) => s + (a === quizBank[i].answer ? 2 : 0), 0);
    setResult({ score, total: quizBank.length * 2 });
    saveAttempt(course.slug, score, quizBank.length * 2);
  };

  const submitted = store.submissions.filter((s) => s.course === course.slug);

  return (
    <PortalShell title={course.title} subtitle={`${course.code} · ${course.faculty} · ${course.credits} credits`} groups={studentNav}>
      <div className="mb-4">
        <Link href="/student/courses" className="text-[11.5px] font-semibold text-brand-700 hover:underline">← All courses</Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Materials</p>
            <ul className="mt-3 divide-y divide-beige/60">
              {course.materials.map((m) => (
                <li key={m.title} className="flex items-center gap-3 py-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-[10px] font-bold text-brand-700">{m.type.slice(0, 3).toUpperCase()}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-medium text-ink">{m.title}</p>
                    <p className="text-[10.5px] text-slate-500">{m.type} · {m.size}</p>
                  </div>
                  <button className="text-[11.5px] font-semibold text-brand-700 hover:underline">Open</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Assignments</p>
            <ul className="mt-3 space-y-2">
              {course.assignments.map((a) => {
                const sub = submitted.find((s) => s.assignmentId === a.id);
                return (
                  <li key={a.id} className="rounded-xl border border-beige/70 bg-ivory/50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-[12.5px] font-semibold text-ink">{a.title}</p>
                        <p className="text-[10.5px] text-slate-500">Due {a.due} · {a.status}{a.score !== "—" ? ` · ${a.score}` : ""}</p>
                      </div>
                      {sub ? (
                        <span className="badge-green">Submitted · {sub.plagiarism} match</span>
                      ) : a.status === "Open" ? (
                        <label className="btn-outline btn-sm cursor-pointer">
                          Upload
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              submitAssignment(a.id, course.slug, f.name);
                              setUploaded(a.id);
                            }}
                          />
                        </label>
                      ) : (
                        <span className="badge-slate">{a.status}</span>
                      )}
                    </div>
                    {sub ? <p className="mt-1.5 text-[10.5px] text-slate-500">Resubmission allowed until the deadline · {sub.fileName}</p> : null}
                    {uploaded === a.id ? <p className="mt-1 text-[10.5px] text-brand-700">Uploaded — plagiarism scan queued.</p> : null}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Quizzes</p>
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-slate-400">timed · auto-graded</span>
            </div>

            {result ? (
              <div className="mt-3 rounded-xl border border-brand-300 bg-brand-50/60 p-4">
                <p className="text-[13px] font-semibold text-ink">Submitted — {result.score}/{result.total}</p>
                <p className="text-[11.5px] text-slate-600">Your score is saved to the gradebook immediately.</p>
                <button
                  onClick={() => {
                    setResult(null);
                    setQuizOpen(false);
                    setAnswers(Array(quizBank.length).fill(-1));
                    setSeconds(20 * 60);
                  }}
                  className="btn-outline btn-sm mt-2"
                >
                  Close
                </button>
              </div>
            ) : quizOpen ? (
              <div className="mt-3">
                <div className="flex items-center justify-between rounded-xl bg-sand/70 px-3 py-2 text-[11.5px]">
                  <span className="font-semibold text-ink">Quiz 3 — ensembles</span>
                  <span className="font-mono text-brand-700">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</span>
                </div>
                <ol className="mt-3 space-y-3">
                  {quizBank.map((q, qi) => (
                    <li key={q.q}>
                      <p className="text-[12.5px] font-medium text-ink">{qi + 1}. {q.q}</p>
                      <div className="mt-1.5 grid gap-1 sm:grid-cols-2">
                        {q.options.map((o, oi) => (
                          <button
                            key={o}
                            onClick={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                            className={`rounded-lg border px-2.5 py-1.5 text-left text-[11.5px] transition ${
                              answers[qi] === oi ? "border-brand-500 bg-brand-50 text-brand-800" : "border-beige bg-ivory/60 text-slate-600 hover:border-accent-500/60"
                            }`}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
                <button onClick={finishQuiz} className="btn-primary btn-sm mt-3 w-full">Submit quiz</button>
              </div>
            ) : (
              <ul className="mt-3 space-y-2">
                {course.quizzes.length === 0 ? <li className="text-[12px] text-slate-500">No quizzes scheduled.</li> : null}
                {course.quizzes.map((q) => (
                  <li key={q.id} className="flex items-center justify-between gap-2 rounded-xl border border-beige/70 bg-ivory/50 px-3 py-2">
                    <div>
                      <p className="text-[12px] font-semibold text-ink">{q.title}</p>
                      <p className="text-[10.5px] text-slate-500">{q.duration} · {q.questions} questions</p>
                    </div>
                    {q.status === "Open" ? (
                      <button onClick={() => setQuizOpen(true)} className="btn-primary btn-sm">Start</button>
                    ) : (
                      <span className="badge-slate">{q.status}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Announcements</p>
            <ul className="mt-3 space-y-2.5">
              {course.announcements.map((a) => (
                <li key={a.at} className="border-l-2 border-accent-500/60 pl-3">
                  <p className="text-[12px] leading-relaxed text-slate-700">{a.text}</p>
                  <p className="text-[10px] text-slate-400">{a.at}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Discussion</p>
            <ul className="mt-3 space-y-2">
              {[
                { who: "Ritwik M.", text: "Is the quiz on ensembles open book?", at: "2 h ago" },
                { who: "Dr. A. Sengupta", text: "No — closed book, but you get a formula sheet.", at: "1 h ago" },
                { who: "Sohini R.", text: "Sharing the feature-engineering notebook from lab.", at: "35 min ago" },
              ].map((d) => (
                <li key={d.text} className="rounded-xl bg-ivory/60 p-2.5">
                  <p className="text-[11px] font-semibold text-ink">{d.who} <span className="font-normal text-slate-400">· {d.at}</span></p>
                  <p className="mt-0.5 text-[11.5px] text-slate-600">{d.text}</p>
                </li>
              ))}
            </ul>
            <input className="input mt-3" placeholder="Write a reply… (demo)" />
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
