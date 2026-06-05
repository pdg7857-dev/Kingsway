/**
 * Generate the auth secrets for the engine. Run once, then paste the values
 * into your environment (local .env or Vercel project env vars).
 *
 *   npx tsx scripts/auth-setup.ts "your-chosen-password"
 */

import { randomBytes } from "crypto";
import { base32Encode, otpauthUrl } from "../src/lib/totp";

const password = process.argv[2] || "(choose-a-strong-password)";
const totpSecret = base32Encode(new Uint8Array(randomBytes(20)));
const sessionSecret = randomBytes(32).toString("hex");
const url = otpauthUrl(totpSecret, "operator", "Opportunity Intelligence Engine");

console.log(`
Opportunity Intelligence Engine — auth setup
============================================

1) Set these environment variables (local .env or Vercel project settings):

   OPERATOR_PASSWORD="${password}"
   TOTP_SECRET="${totpSecret}"
   SESSION_SECRET="${sessionSecret}"

2) Add the 2FA secret to your authenticator app (Google Authenticator, Authy,
   1Password). Either scan a QR for this URL, or use "enter a setup key" and
   paste the secret manually:

   Setup key (TOTP_SECRET): ${totpSecret}
   otpauth URL:            ${url}

3) Redeploy / restart. Sign in with the password plus the 6-digit code.

Keep these secret. Re-run this script to rotate them.
`);
