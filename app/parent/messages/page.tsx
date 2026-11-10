"use client";

import { useState } from "react";
import PortalShell, { parentNav } from "@/components/PortalShell";
import { parent, parentMessages } from "@/lib/portals";
import { sendMessage, useStaffStore } from "@/lib/staffStore";

export default function ParentMessagesPage() {
  const store = useStaffStore();
  const [text, setText] = useState("");
  const [to, setTo] = useState("Dr. A. Sengupta");

  const thread = [
    ...parentMessages,
    ...store.messages.filter((m) => m.from === "You"),
  ];

  return (
    <PortalShell
      title="Messages"
      subtitle="Class mentor, subject faculty and the accounts office"
      groups={parentNav}
      person={{ name: parent.name, sub: "Parent · 2 wards" }}
    >
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <div className="card p-3">
          <p className="px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Conversations</p>
          <ul className="mt-2 space-y-1">
            {["Dr. A. Sengupta", "Prof. R. Mitra", "Accounts office"].map((c) => (
              <li key={c}>
                <button
                  onClick={() => setTo(c)}
                  className={`w-full rounded-xl px-2.5 py-2 text-left text-[12px] font-medium transition ${to === c ? "bg-brand-600 text-ivory" : "text-slate-600 hover:bg-ivory/70"}`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card flex h-[520px] flex-col p-0">
          <div className="flex items-center justify-between border-b border-beige px-4 py-3">
            <div>
              <p className="text-[13px] font-semibold text-ink">{to}</p>
              <p className="text-[10.5px] text-slate-500">{to === "Accounts office" ? "Fee queries" : "Faculty · Computer Science"}</p>
            </div>
            <span className="badge-green">Online</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {thread.map((m, i) => (
              <div key={i} className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${m.from === "You" ? "ml-auto bg-brand-600 text-ivory" : "bg-ivory/70 text-slate-700"}`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-70">{m.from} · {m.at}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              sendMessage("You", "Parent", text);
              setText("");
            }}
            className="flex gap-2 border-t border-beige p-3"
          >
            <input className="input" placeholder={`Message ${to}…`} value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn-primary btn-sm shrink-0">Send</button>
          </form>
        </div>
      </div>
    </PortalShell>
  );
}
