import Link from "next/link";
import { notices } from "@/lib/data";
import { fmtDate } from "@/lib/utils";

export default function NoticeTicker() {
  const items = notices.slice(0, 5);
  const row = [...items, ...items];
  return (
    <div className="ticker flex items-stretch overflow-hidden rounded-2xl border border-brand-700/20 bg-brand-900 text-white">
      <div className="flex shrink-0 items-center gap-2 bg-accent-500 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        Live notices
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="ticker-track py-3 text-[13px]">
          {row.map((n, i) => (
            <Link key={`${n.id}-${i}`} href="/notices" className="inline-flex items-center gap-2 text-brand-100 hover:text-white">
              <span className="text-accent-400">◆</span>
              <span className="font-semibold text-white">{fmtDate(n.date)}</span>
              {n.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
