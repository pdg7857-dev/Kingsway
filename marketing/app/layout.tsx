import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Government Opportunity Intelligence Index™ & Opportunity Waste Calculator",
  description:
    "See your Government Opportunity Intelligence Index™ and estimate how much your team wastes reviewing government opportunities that never become bids.",
  applicationName: "Government Opportunity Intelligence",
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
