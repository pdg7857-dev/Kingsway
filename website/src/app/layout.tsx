import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { SITE } from "@/lib/site/config";
import { JsonLd, organizationJsonLd } from "@/lib/site/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "Government Opportunity Intelligence | Phil finds the bids worth winning",
    template: "%s | Phil, Government Opportunity Intelligence",
  },
  description:
    "Phil monitors every procurement platform, reads the documents and qualifies the fit, so contractors across Canada and the U.S. stop searching portals and start bidding the work that is worth winning.",
  applicationName: SITE.brandFull,
  authors: [{ name: "Phil" }],
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
