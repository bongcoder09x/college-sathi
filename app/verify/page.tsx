import type { Metadata } from "next";
import VerifyForm from "@/components/VerifyForm";

export const metadata: Metadata = {
  title: "Certificate verification",
  description: "Employers and universities can verify a College Sathi certificate using its verification ID or QR code.",
};

export default function VerifyIndexPage() {
  return (
    <div className="shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <div>
          <p className="eyebrow">For employers & universities</p>
          <h1 className="h1 mt-2 max-w-xl text-ink">Verify a certificate in seconds</h1>
          <p className="muted mt-4 max-w-xl">
            Every certificate issued from the 2026 session carries a QR code and a verification ID printed beside the
            registrar's signature. Scan the code, or type the ID, and this page confirms the holder, programme, campus
            and issue date — with no login.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { t: "Tamper evident", d: "Each ID maps to one issued record." },
              { t: "Status aware", d: "Revoked certificates are flagged in red." },
              { t: "Public", d: "No account needed to verify." },
            ].map((x) => (
              <div key={x.t} className="card p-4">
                <p className="text-[13px] font-semibold text-ink">{x.t}</p>
                <p className="mt-1 text-[12px] text-slate-500">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
        <VerifyForm />
      </div>
    </div>
  );
}
