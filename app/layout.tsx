import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { BRAND } from "@/lib/data";
import { currentTenant } from "@/lib/tenant";

export const metadata: Metadata = {
  title: {
    default: `${BRAND.latin} — Admissions, results & student services`,
    template: `%s · ${BRAND.latin}`,
  },
  description: BRAND.promise,
  keywords: [
    "college admission",
    "B.Tech admission West Bengal",
    "online application",
    "result lookup",
    "certificate verification",
  ],
  openGraph: {
    title: `${BRAND.latin} — ${BRAND.tagline}`,
    description: BRAND.promise,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tenant = currentTenant();
  return (
    <html lang="en-IN">
      <body className="min-h-screen bg-cream font-sans">
        <div className="flex min-h-screen flex-col">
          <SiteHeader tenant={tenant} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
