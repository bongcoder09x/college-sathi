import type { Metadata } from "next";
import NoticesBrowser from "@/components/NoticesBrowser";
import { notices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Notices & circulars",
  description: "Admission notifications, examination circulars, results and general notices from College Sathi.",
};

export default function NoticesPage() {
  return (
    <div className="shell py-12">
      <p className="eyebrow">Notice board</p>
      <h1 className="h1 mt-2 text-ink">Notices, circulars & results</h1>
      <p className="muted mt-3 max-w-2xl">
        Everything the college publishes, in one searchable list. Attachments are shown with each notice — in this demo
        they are placeholders.
      </p>
      <div className="mt-8">
        <NoticesBrowser notices={notices} />
      </div>
    </div>
  );
}
