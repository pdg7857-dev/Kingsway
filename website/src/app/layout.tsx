import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { SITE } from "@/lib/site/config";
import { JsonLd, organizationJsonLd } from "@/lib/site/seo";
import { SiteAnalytics } from "@/components/site/analytics";

// Bold, editorial display face for headings (the report "vibe"); Inter for body.
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "GovOps Intelligence | Phil Dave finds the bids worth winning",
    template: "%s | GovOps Intelligence",
  },
  description:
    "Phil Dave monitors every procurement platform, reads the documents and qualifies the fit, so contractors across Canada and the U.S. stop searching portals and start bidding the work that is worth winning.",
  applicationName: SITE.brandFull,
  authors: [{ name: "Phil Dave" }],
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={organizationJsonLd()} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <SiteAnalytics />
      </body>
    </html>
  );
}
