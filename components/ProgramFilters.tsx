"use client";

import { useMemo, useState } from "react";
import type { Program } from "@/lib/types";
import { campuses } from "@/lib/data";
import ProgramCard from "./ProgramCard";

type Sort = "name" | "fees" | "duration";

export default function ProgramFilters({ programs }: { programs: Program[] }) {
  const [campus, setCampus] = useState("all");
  const [level, setLevel] = useState("all");
  const [department, setDepartment] = useState("all");
  const [mode, setMode] = useState("all");
  const [sort, setSort] = useState<Sort>("name");
  const [query, setQuery] = useState("");

  const departments = useMemo(
    () => Array.from(new Set(programs.map((p) => p.department))).sort(),
    [programs]
  );

  const filtered = useMemo(() => {
    const list = programs.filter((p) => {
      const okCampus = campus === "all" || p.campuses.includes(campus);
      const okLevel = level === "all" || p.level === level;
      const okDept = department === "all" || p.department === department;
      const okMode = mode === "all" || p.mode === mode;
      const okQuery =
        !query.trim() ||
        (p.name + " " + p.department + " " + p.shortName).toLowerCase().includes(query.trim().toLowerCase());
      return okCampus && okLevel && okDept && okMode && okQuery;
    });
    const years = (p: Program) => parseInt(p.duration, 10) || 0;
    return list.sort((a, b) => {
      if (sort === "fees") return a.feesPerYear - b.feesPerYear;
      if (sort === "duration") return years(a) - years(b) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [programs, campus, level, department, mode, sort, query]);

  const reset = () => {
    setCampus("all");
    setLevel("all");
    setDepartment("all");
    setMode("all");
    setQuery("");
  };

  const activeCount = [campus, level, department, mode].filter((v) => v !== "all").length + (query ? 1 : 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg">Filter</p>
            {activeCount > 0 ? (
              <button onClick={reset} className="text-[12px] font-semibold text-brand-700 hover:underline">
                Clear ({activeCount})
              </button>
            ) : null}
          </div>

          <div className="mt-4">
            <label className="label" htmlFor="q">Search</label>
            <input
              id="q"
              className="input"
              placeholder="Programme or department"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <FilterGroup title="Campus" value={campus} onChange={setCampus}
            options={[{ value: "all", label: "All campuses" }, ...campuses.map((c) => ({ value: c.slug, label: c.shortName }))]} />

          <FilterGroup title="Level" value={level} onChange={setLevel}
            options={[
              { value: "all", label: "All levels" },
              { value: "UG", label: "Undergraduate" },
              { value: "PG", label: "Postgraduate" },
              { value: "Diploma", label: "Diploma" },
            ]} />

          <FilterGroup title="Department" value={department} onChange={setDepartment}
            options={[{ value: "all", label: "All departments" }, ...departments.map((d) => ({ value: d, label: d }))]} />

          <FilterGroup title="Mode" value={mode} onChange={setMode}
            options={[
              { value: "all", label: "Any mode" },
              { value: "On-campus", label: "On-campus" },
              { value: "Hybrid", label: "Hybrid" },
              { value: "Online", label: "Online" },
            ]} />

          <div className="mt-5 border-t border-slate-200 pt-4">
            <label className="label" htmlFor="sort">Sort by</label>
            <select id="sort" className="input" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="name">Name (A–Z)</option>
              <option value="fees">Fees (low to high)</option>
              <option value="duration">Duration (shortest)</option>
            </select>
          </div>
        </div>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-600">
            <strong className="text-ink">{filtered.length}</strong> programme{filtered.length === 1 ? "" : "s"} match your filters
          </p>
          <p className="text-[12px] text-slate-400">Fees shown are per year, tuition only</p>
        </div>
        {filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="font-display text-xl">No programme matches that combination</p>
            <p className="muted mt-2">Try clearing a filter or widening the campus.</p>
            <button onClick={reset} className="btn-outline btn-sm mt-4">Reset filters</button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map((p) => (
              <ProgramCard key={p.slug} program={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  value,
  onChange,
  options,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="mt-4">
      <p className="label">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`chip !px-3 !py-1 !text-[12px] ${value === o.value ? "chip-active" : ""}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
