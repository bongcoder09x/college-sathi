"use client";

import { useEffect, useState } from "react";

type Store = {
  child: string;
  outpasses: { id: string; child: string; reason: string; when: string; status: "Pending" | "Approved" | "Rejected" }[];
  ptm: { slot: string; child: string } | null;
  messages: { from: string; role: string; at: string; text: string }[];
  attendanceSessions: { id: string; section: string; subject: string; mode: string; startedAt: string; present: number; suspicious: number; open: boolean }[];
  gradebook: { roll: string; name: string; ct1: number; ct2: number; assignment: number; lab: number }[] | null;
  gradebookLocked: boolean;
  staffLeaves: { id: string; from: string; to: string; type: string; status: string }[];
  builder: Record<string, string[]> | null;
  builderVersion: string;
  approvals: Record<string, string>;
  notifications: string[];
};

const KEY = "cs_staff_v1";
const listeners = new Set<() => void>();

function empty(): Store {
  return {
    child: "ananya",
    outpasses: [
      { id: "OP-118", child: "ananya", reason: "Late lab — returning by 8 PM", when: "2026-11-12 18:00", status: "Pending" },
      { id: "OP-102", child: "riddhi", reason: "Cousin's wedding, outstation", when: "2026-11-08 09:00", status: "Approved" },
    ],
    ptm: null,
    messages: [],
    attendanceSessions: [],
    gradebook: null,
    gradebookLocked: false,
    staffLeaves: [],
    builder: null,
    builderVersion: "v3 · published 02/11/2026",
    approvals: {},
    notifications: [],
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

const ref = (p: string) => `${p}-${Math.floor(Math.random() * 900) + 100}`;

export function setChild(id: string) {
  const s = read();
  write({ ...s, child: id });
}

export function decideOutpass(id: string, status: "Approved" | "Rejected") {
  const s = read();
  write({ ...s, outpasses: s.outpasses.map((o) => (o.id === id ? { ...o, status } : o)) });
}

export function bookPtm(slot: string, child: string) {
  const s = read();
  write({ ...s, ptm: { slot, child } });
}

export function sendMessage(from: string, role: string, text: string) {
  const s = read();
  write({ ...s, messages: [...s.messages, { from, role, at: "just now", text }] });
}

export function startSession(section: string, subject: string, mode: string) {
  const s = read();
  const entry = { id: ref("AS"), section, subject, mode, startedAt: new Date().toISOString().slice(11, 16), present: 0, suspicious: 0, open: true };
  write({ ...s, attendanceSessions: [entry, ...s.attendanceSessions] });
  return entry;
}

export function tickSession(id: string) {
  const s = read();
  write({
    ...s,
    attendanceSessions: s.attendanceSessions.map((a) =>
      a.id === id && a.open
        ? { ...a, present: Math.min(58, a.present + Math.floor(Math.random() * 4) + 1), suspicious: a.suspicious + (Math.random() > 0.85 ? 1 : 0) }
        : a
    ),
  });
}

export function closeSession(id: string) {
  const s = read();
  write({ ...s, attendanceSessions: s.attendanceSessions.map((a) => (a.id === id ? { ...a, open: false } : a)) });
}

export function saveGradebook(rows: NonNullable<Store["gradebook"]>) {
  const s = read();
  write({ ...s, gradebook: rows });
}

export function lockGradebook() {
  const s = read();
  write({ ...s, gradebookLocked: true, notifications: ["Internal marks locked and submitted to the HoD", ...s.notifications] });
}

export function applyStaffLeave(from: string, to: string, type: string) {
  const s = read();
  const entry = { id: ref("SL"), from, to, type, status: "Pending" };
  write({ ...s, staffLeaves: [entry, ...s.staffLeaves] });
  return entry;
}

export function saveBuilder(grid: Record<string, string[]>, publish: boolean) {
  const s = read();
  write({
    ...s,
    builder: grid,
    builderVersion: publish ? `v4 · published ${new Date().toISOString().slice(0, 10).split("-").reverse().join("/")}` : s.builderVersion,
    notifications: publish ? ["Timetable v4 published to faculty and students", ...s.notifications] : s.notifications,
  });
}

export function setApproval(code: string, status: string) {
  const s = read();
  write({ ...s, approvals: { ...s.approvals, [code]: status } });
}

export function notifyParents(names: string[]) {
  const s = read();
  write({ ...s, notifications: [`Shortage SMS queued for ${names.length} guardians`, ...s.notifications] });
}

export function useStaffStore() {
  const [state, setState] = useState<Store>(() => empty());
  useEffect(() => {
    setState(read());
    return subscribe(() => setState(read()));
  }, []);
  return state;
}
