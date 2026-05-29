import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { SITE } from "@/lib/site/config";
import { JsonLd, organizationJsonLd } from "@/lib/site/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "Government Opportunity Intelligence | Phil Dave finds the bids worth winning",
    template: "%s | Phil Dave, Government Opportunity Intelligence",
  },
  description:
    "Phil Dave monitors every procurement platform, reads the documents and qualifies the fit, so contractors across Canada and the U.S. stop wasting estimator time and bid only the work worth winning.",
  applicationName: SITE.brandFull,
  authors: [{ name: "Phil Dave" }],
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={organizationJsonLd()} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
