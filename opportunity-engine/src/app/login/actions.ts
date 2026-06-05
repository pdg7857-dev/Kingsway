"use server";

import { redirect } from "next/navigation";
import { verifyTotp } from "@/lib/totp";
import { startSession, endSession, safeEqual } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const code = String(formData.get("code") ?? "").replace(/\s/g, "");

  const expectedPw = process.env.OPERATOR_PASSWORD ?? "";
  const totpSecret = process.env.TOTP_SECRET ?? "";

  // Both factors are required and must be configured. If the env is not set,
  // login cannot succeed (fail closed).
  const okPw = expectedPw.length > 0 && safeEqual(password, expectedPw);
  const okCode = totpSecret.length > 0 && (await verifyTotp(totpSecret, code));

  if (!okPw || !okCode) redirect("/login?error=1");

  await startSession();
  redirect("/");
}

export async function logout() {
  endSession();
  redirect("/login");
}
