"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "@/lib/session";
import { student } from "@/lib/portal";

export type NavItem = { href: string; label: string; icon: string; badge?: string };
export type NavGroup = { title: string; items: NavItem[] };

export default function PortalShell({
  title,
  subtitle,
  groups,
  children,
  footer,
  person,
}: {
  title: string;
  subtitle?: string;
  groups: NavGroup[];
  children: React.ReactNode;
  footer?: React.ReactNode;
  person?: { name: string; sub: string };
}) {
  const pathname = usePathname() || "";
  const { session } = useSession();
  const [open, setOpen] = useState(false);

  const active = (href: string) => {
    const clean = href.split("?")[0].replace(/\/$/, "");
    const depth = clean.split("/").filter(Boolean).length;
    return depth <= 1 ? pathname.replace(/\/$/, "") === clean : pathname.startsWith(clean);
  };

  return (
    <div className="shell py-8">
      <div className="grid gap-6 lg:grid-cols-[248px_1fr]">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card overflow-hidden p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 font-display text-lg text-ivory ring-1 ring-accent-500/40">
                {(person?.name || student.name).charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold text-ink">{session?.name || person?.name || student.name}</p>
                <p className="truncate text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  {person?.sub || `${session?.role || "Student"} · ${student.rollNo}`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              className="btn-outline btn-sm mt-3 w-full lg:hidden"
            >
              {open ? "Hide menu" : "Browse menu"}
            </button>

            <nav className={`mt-3 space-y-4 ${open ? "block" : "hidden"} lg:block`}>
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="px-2 text-[9.5px] font-bold uppercase tracking-[0.2em] text-slate-400">{group.title}</p>
                  <ul className="mt-1.5 space-y-0.5">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[12.5px] font-medium transition duration-300 ease-lux ${
                            active(item.href)
                              ? "bg-brand-600 text-ivory shadow-[0_10px_22px_-14px_rgba(169,0,42,.9)]"
                              : "text-slate-600 hover:bg-ivory/80 hover:text-brand-700"
                          }`}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="shrink-0">
                            <path d={item.icon} />
                          </svg>
                          <span className="flex-1">{item.label}</span>
                          {item.badge ? (
                            <span className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-bold ${active(item.href) ? "bg-ivory/25 text-ivory" : "bg-accent-100 text-accent-700"}`}>
                              {item.badge}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="mt-4 border-t border-beige pt-3">
              {session ? (
                <button onClick={signOut} className="btn-ghost btn-sm w-full justify-start text-[12px]">
                  Sign out
                </button>
              ) : (
                <Link href="/login" className="btn-outline btn-sm w-full">Sign in</Link>
              )}
            </div>
          </div>
          {footer}
        </aside>

        {/* content */}
        <div>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">{person?.sub ? person.sub.split("·")[0] : `${student.program} · ${student.semester}`}</p>
              <h1 className="h2 mt-1">{title}</h1>
              {subtitle ? <p className="muted mt-1 text-[13px]">{subtitle}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/results/lookup" className="btn-outline btn-sm">Result lookup</Link>
              <Link href="/contact" className="btn-ghost btn-sm">Help</Link>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export const studentNav: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { href: "/student", label: "Dashboard", icon: "M4 13h6V4H4v9Zm10 7h6v-9h-6v9ZM4 20h6v-4H4v4Zm10-11h6V4h-6v5Z" },
      { href: "/student/profile", label: "Profile", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 8a8 8 0 0 1 16 0" },
      { href: "/student/timetable", label: "Timetable", icon: "M4 6h16v14H4zM8 3v4M16 3v4M4 10h16" },
      { href: "/student/attendance", label: "Attendance", icon: "m4 12 5 5L20 6" },
    ],
  },
  {
    title: "Academics",
    items: [
      { href: "/student/courses", label: "Courses (LMS)", icon: "M4 5h16v12H4zM8 21h8" },
      { href: "/student/exams", label: "Exams & results", icon: "M8 3h8l4 4v14H4V3h4Z" },
      { href: "/student/fees", label: "Fees", icon: "M3 7h18v10H3zM3 11h18" },
    ],
  },
  {
    title: "Campus life",
    items: [
      { href: "/student/library", label: "Library", icon: "M4 4h7v16H4zM13 4h7v16h-7z" },
      { href: "/student/hostel", label: "Hostel", icon: "M3 20V9l9-5 9 5v11M9 20v-6h6v6" },
      { href: "/student/transport", label: "Transport", icon: "M5 17h14M6 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM4 13V7h16v6" },
      { href: "/student/helpdesk", label: "Helpdesk", icon: "M12 18h.01M9 9a3 3 0 1 1 4.5 2.6c-.9.6-1.5 1.2-1.5 2.4" },
    ],
  },
];


export const parentNav: NavGroup[] = [
  {
    title: "My child",
    items: [
      { href: "/parent", label: "Dashboard", icon: "M4 13h6V4H4v9Zm10 7h6v-9h-6v9ZM4 20h6v-4H4v4Zm10-11h6V4h-6v5Z" },
      { href: "/parent/attendance", label: "Attendance & approvals", icon: "m4 12 5 5L20 6", badge: "1" },
      { href: "/parent/results", label: "Results & progress", icon: "M4 19V9m6 10V5m6 14v-7" },
      { href: "/parent/fees", label: "Fees", icon: "M3 7h18v10H3zM3 11h18" },
      { href: "/parent/transport", label: "Live bus", icon: "M5 17h14M6 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM4 13V7h16v6" },
    ],
  },
  {
    title: "Connect",
    items: [
      { href: "/parent/messages", label: "Messages", icon: "M4 5h16v10H8l-4 4V5Z" },
      { href: "/parent/ptm", label: "PTM booking", icon: "M4 6h16v14H4zM8 3v4M16 3v4M4 10h16" },
    ],
  },
];

export const facultyNav: NavGroup[] = [
  {
    title: "Teaching",
    items: [
      { href: "/faculty", label: "Dashboard", icon: "M4 13h6V4H4v9Zm10 7h6v-9h-6v9ZM4 20h6v-4H4v4Zm10-11h6V4h-6v5Z" },
      { href: "/faculty/timetable", label: "My timetable", icon: "M4 6h16v14H4zM8 3v4M16 3v4M4 10h16" },
      { href: "/faculty/attendance", label: "Attendance", icon: "m4 12 5 5L20 6", badge: "2" },
      { href: "/faculty/courses", label: "Courses", icon: "M4 5h16v12H4zM8 21h8" },
      { href: "/faculty/gradebook", label: "Gradebook", icon: "M4 4h16v16H4zM8 9h8M8 13h8M8 17h5" },
    ],
  },
  {
    title: "Mine",
    items: [
      { href: "/faculty/mentees", label: "Mentees", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 8a8 8 0 0 1 16 0" },
      { href: "/faculty/leave", label: "Leave", icon: "M6 3v18M18 3v18M6 8h12" },
      { href: "/faculty/payslips", label: "Payslips", icon: "M8 3h8l4 4v14H4V3h4Z" },
    ],
  },
];

export const academicsNav: NavGroup[] = [
  {
    title: "Department",
    items: [
      { href: "/academics", label: "Dashboard", icon: "M4 13h6V4H4v9Zm10 7h6v-9h-6v9ZM4 20h6v-4H4v4Zm10-11h6V4h-6v5Z" },
      { href: "/academics/allocation", label: "Subject allocation", icon: "M4 6h7v5H4zM13 6h7v5h-7zM4 13h7v5H4zM13 13h7v5h-7z" },
      { href: "/academics/timetable", label: "Timetable builder", icon: "M4 6h16v14H4zM8 3v4M16 3v4M4 10h16" },
    ],
  },
  {
    title: "Approvals",
    items: [
      { href: "/academics/approvals", label: "Marks approval", icon: "m4 12 5 5L20 6", badge: "2" },
      { href: "/academics/shortage", label: "Shortage list", icon: "M12 9v4m0 4h.01M4 20h16L12 4 4 20Z" },
    ],
  },
];
