"use client";

import { useEffect, useState } from "react";

export type Role = "Student" | "Parent" | "Staff" | "Admin";

export type Session = {
  name: string;
  role: Role;
  campus: string;
  email: string;
  method: "password" | "otp" | "sso";
  twoFactor?: boolean;
};

const KEY = "cs_session_v1";
const listeners = new Set<() => void>();

export const demoAccounts = [
  { label: "Student", name: "Ananya Dasgupta", email: "ananya.dasgupta@example.com", role: "Student" as Role },
  { label: "Parent", name: "Subrata Dasgupta", email: "subrata.d@example.com", role: "Parent" as Role },
  { label: "Staff", name: "Dr. A. Sengupta", email: "a.sengupta@collegesathi.edu.in", role: "Staff" as Role },
  { label: "Admin", name: "Registrar office", email: "registrar@collegesathi.edu.in", role: "Admin" as Role },
];

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function notify() {
  listeners.forEach((l) => l());
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(session: Session) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch {}
  notify();
}

export function signOut() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
  notify();
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setReady(true);
    return subscribe(() => setSession(getSession()));
  }, []);

  return { session, ready };
}
