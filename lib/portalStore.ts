"use client";

import { useEffect, useState } from "react";

/** Small localStorage-backed store for the things a student can create in the portal. */

export type LeaveRequest = {
  id: string;
  from: string;
  to: string;
  kind: "Leave" | "Condonation";
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

export type Ticket = { id: string; subject: string; category: string; status: string; updated: string; body?: string };
export type Outpass = { id: string; reason: string; from: string; to: string; status: string };
export type Submission = { assignmentId: string; course: string; fileName: string; at: string; plagiarism: string };
export type Attempt = { quizId: string; score: number; total: number; at: string };
export type CertificateRequest = { type: string; status: string; raised: string; eta: string };

type Store = {
  leaves: LeaveRequest[];
  tickets: Ticket[];
  outpasses: Outpass[];
  complaints: Ticket[];
  submissions: Submission[];
  attempts: Attempt[];
  revaluations: { code: string; subject: string; status: string; at: string }[];
  reservations: { title: string; at: string; status: string }[];
  certificates: CertificateRequest[];
  payments: { head: string; amount: number; receipt: string; at: string; mode: string }[];
};

const KEY = "cs_portal_v1";
const listeners = new Set<() => void>();

function empty(): Store {
  return {
    leaves: [
      { id: "LV-221", from: "2026-09-12", to: "2026-09-13", kind: "Leave", reason: "Fever — medical certificate attached", status: "Approved", createdAt: "2026-09-11" },
      { id: "LV-238", from: "2026-10-21", to: "2026-10-21", kind: "Condonation", reason: "Family function out of town", status: "Pending", createdAt: "2026-10-20" },
    ],
    tickets: [],
    outpasses: [{ id: "OP-88", reason: "Dentist appointment", from: "2026-10-18 10:00", to: "2026-10-18 15:00", status: "Approved" }],
    complaints: [],
    submissions: [
      { assignmentId: "A3", course: "machine-learning", fileName: "ml-assignment-3.pdf", at: "2026-10-22 21:14", plagiarism: "3%" },
      { assignmentId: "A2", course: "compiler-design", fileName: "parser-report.pdf", at: "2026-10-09 18:40", plagiarism: "2%" },
    ],
    attempts: [{ quizId: "Q2", score: 8, total: 10, at: "2026-10-06 11:20" }],
    revaluations: [],
    reservations: [],
    certificates: [
      { type: "Bonafide certificate", status: "In progress", raised: "2026-11-08", eta: "2026-11-14" },
      { type: "Transfer certificate", status: "Not requested", raised: "—", eta: "—" },
      { type: "Character certificate", status: "Issued", raised: "2026-08-30", eta: "2026-09-04" },
    ],
    payments: [],
  };
}

let cache: Store | null = null;

function read(): Store {
  if (typeof window === "undefined") return empty();
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...empty(), ...(JSON.parse(raw) as Store) } : empty();
  } catch {
    cache = empty();
  }
  return cache;
}

function write(next: Store) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function snapshot(): Store {
  return read();
}

const ref = (prefix: string) => `${prefix}-${Math.floor(Math.random() * 9000) + 1000}`;
const now = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export function addLeave(input: Omit<LeaveRequest, "id" | "status" | "createdAt">) {
  const s = read();
  const entry: LeaveRequest = { ...input, id: ref("LV"), status: "Pending", createdAt: new Date().toISOString().slice(0, 10) };
  write({ ...s, leaves: [entry, ...s.leaves] });
  return entry;
}

export function addTicket(subject: string, category: string, body: string) {
  const s = read();
  const entry: Ticket = { id: ref("HD"), subject, category, body, status: "Open", updated: new Date().toISOString().slice(0, 10) };
  write({ ...s, tickets: [entry, ...s.tickets] });
  return entry;
}

export function addComplaint(subject: string, category: string, body: string) {
  const s = read();
  const entry: Ticket = { id: ref("HC"), subject, category, body, status: "Open", updated: new Date().toISOString().slice(0, 10) };
  write({ ...s, complaints: [entry, ...s.complaints] });
  return entry;
}

export function addOutpass(reason: string, from: string, to: string) {
  const s = read();
  const entry: Outpass = { id: ref("OP"), reason, from, to, status: "Pending" };
  write({ ...s, outpasses: [entry, ...s.outpasses] });
  return entry;
}

export function submitAssignment(assignmentId: string, course: string, fileName: string) {
  const s = read();
  const plagiarism = `${(Math.random() * 4 + 1).toFixed(0)}%`;
  const entry: Submission = { assignmentId, course, fileName, at: now(), plagiarism };
  write({ ...s, submissions: [entry, ...s.submissions.filter((x) => !(x.assignmentId === assignmentId && x.course === course))] });
  return entry;
}

export function saveAttempt(quizId: string, score: number, total: number) {
  const s = read();
  write({ ...s, attempts: [{ quizId, score, total, at: now() }, ...s.attempts] });
}

export function requestRevaluation(code: string, subject: string) {
  const s = read();
  const entry = { code, subject, status: "Requested", at: new Date().toISOString().slice(0, 10) };
  write({ ...s, revaluations: [entry, ...s.revaluations.filter((x) => x.code !== code)] });
  return entry;
}

export function reserveBook(title: string) {
  const s = read();
  const entry = { title, at: new Date().toISOString().slice(0, 10), status: "Reserved" };
  write({ ...s, reservations: [entry, ...s.reservations] });
  return entry;
}

export function requestCertificate(type: string) {
  const s = read();
  const next = s.certificates.map((c) =>
    c.type === type ? { ...c, status: "In progress", raised: new Date().toISOString().slice(0, 10), eta: "7 working days" } : c
  );
  write({ ...s, certificates: next });
}

export function payFee(head: string, amount: number, mode: string) {
  const s = read();
  const entry = { head, amount, mode, receipt: `RCPT-2026-${Math.floor(Math.random() * 900000) + 100000}`, at: new Date().toISOString().slice(0, 16).replace("T", " ") };
  write({ ...s, payments: [entry, ...s.payments] });
  return entry;
}

export function usePortalStore() {
  const [state, setState] = useState<Store>(() => empty());
  useEffect(() => {
    setState(read());
    return subscribe(() => setState(read()));
  }, []);
  return state;
}
