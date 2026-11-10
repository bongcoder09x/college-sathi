import { notFound } from "next/navigation";
import Link from "next/link";
import Wizard from "@/components/Wizard";
import { getApplication } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function ApplicationWizardPage({ params }: { params: { applicationId: string } }) {
  const application = getApplication(params.applicationId);
  if (!application) notFound();

  return (
    <div className="shell py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Admission portal</p>
          <h1 className="h2 mt-1">Application {application.id}</h1>
          <p className="muted mt-1 text-[13px]">
            Every field is saved automatically. You can leave this page and come back with the same link.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/apply" className="btn-outline btn-sm">All applications</Link>
          <Link href={`/apply/${application.id}/status`} className="btn-ghost btn-sm">Status</Link>
        </div>
      </div>
      <Wizard initial={application} />
    </div>
  );
}
