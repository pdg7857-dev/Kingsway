import type { Metadata, Viewport } from 'next';
import { Jost, Inter, Marcellus } from 'next/font/google';
import { config, DISPLAY_STYLE } from '@/lib/config';
import './globals.css';

/**
 * Display family — geometric sans (Lexus-leaning).
 * Swap point: to license the real brand font later, replace this with a
 * local @font-face and update --font-display below.
 */
const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
});

/** Body / UI — clean humanist sans. */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

/** Serif display — used when DISPLAY_STYLE = 'lambo'. */
const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: `${config.fullName} — ${config.title}, ${config.dealership}`,
    template: `%s · ${config.fullName}`,
  },
  description: `Concierge sourcing for new & certified pre-owned Lexus with ${config.fullName}, ${config.title} at ${config.dealership}, ${config.city}.`,
  openGraph: {
    type: 'website',
    title: `${config.fullName} — ${config.title}`,
    description: `The right Lexus, found for you. ${config.dealership}, ${config.city}.`,
    url: config.siteUrl,
    images: ['/og.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Map the display CSS variable to the chosen personality.
  const displayVar =
    DISPLAY_STYLE === 'lambo' ? 'var(--font-marcellus)' : 'var(--font-jost)';

  const fontVars = {
    '--font-display': displayVar,
    '--font-display-fallback': 'Jost, system-ui',
    '--font-serif': 'var(--font-marcellus)',
    '--font-body': 'var(--font-inter)',
  } as React.CSSProperties;

  return (
    <html
      lang="en"
      className={`${jost.variable} ${inter.variable} ${marcellus.variable}`}
      style={fontVars}
    >
      <body>{children}</body>
    </html>
  );
}
