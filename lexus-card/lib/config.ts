/**
 * SINGLE SOURCE OF TRUTH for all personal info + feature flags.
 * Edit ONLY this file to rebrand the site for a different consultant.
 *
 * ⚠️  PLACEHOLDER VALUES — replace everything marked TODO before going live.
 */

/** Switches the entire display-type personality of the site (§4). */
export type DisplayStyle = 'lexus' | 'lambo';
export const DISPLAY_STYLE: DisplayStyle = 'lexus';

export const config = {
  // ── Identity ────────────────────────────────────────────────
  fullName: 'Phil Dave', // TODO: confirm
  title: 'Sales & Leasing Consultant', // TODO: confirm
  dealership: 'Northwest Lexus', // TODO: confirm
  city: 'Brampton, ON',

  // ── Contact (one-tap utilities) ─────────────────────────────
  phone: '+14160000000', // TODO: real mobile, E.164 format
  phoneDisplay: '(416) 000-0000', // TODO: pretty version for display
  email: 'phil@example.com', // TODO: real work email
  dealerAddress: '123 Example Blvd, Brampton, ON L6T 0A1', // TODO: full street address

  // ── Social (optional — leave '' to hide) ────────────────────
  instagramUrl: '', // TODO optional
  linkedinUrl: '', // TODO optional

  // ── Lead routing ────────────────────────────────────────────
  // Where new submissions are emailed. Falls back to env NOTIFY_EMAIL.
  notifyEmail: process.env.NOTIFY_EMAIL || 'phil@example.com', // TODO

  // ── Site ────────────────────────────────────────────────────
  domain: 'cards.phildave.com', // TODO
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cards.phildave.com',

  // ── Proof / stats — PLACEHOLDERS, do not present as real ─────
  // TODO: confirm these numbers before publishing. Left intentionally
  // generic so they are obviously placeholders, never invented claims.
  stats: [
    { value: 0, suffix: '+', label: 'Years in luxury sales' },
    { value: 0, suffix: '+', label: 'Vehicles delivered' },
    { value: 0, suffix: '%', label: 'Repeat & referral' },
  ],
} as const;

/** Derived helpers for one-tap card actions (§9). */
export const links = {
  tel: `tel:${config.phone}`,
  sms: `sms:${config.phone}`,
  mailto: `mailto:${config.email}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    config.dealerAddress
  )}`,
  vcard: '/api/contact.vcf',
} as const;

export type SiteConfig = typeof config;
