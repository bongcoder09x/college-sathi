import type { Metadata } from "next";
import EventsView from "@/components/EventsView";
import { events } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events calendar",
  description: "Open days, entrance tests, cultural festivals, placement drives and sports fixtures across all campuses.",
};

export default function EventsPage() {
  return (
    <div className="shell py-12">
      <p className="eyebrow">Campus calendar</p>
      <h1 className="h1 mt-2 text-ink">What is happening on campus</h1>
      <p className="muted mt-3 max-w-2xl">
        Switch between the calendar and list views. Filter by campus to see only what is relevant to you.
      </p>
      <div className="mt-8">
        <EventsView events={events} />
      </div>
    </div>
  );
}
