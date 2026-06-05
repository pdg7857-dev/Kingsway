import { ShieldCheck } from "lucide-react";
import { login } from "./actions";

export const dynamic = "force-dynamic";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const configured = !!process.env.OPERATOR_PASSWORD && !!process.env.TOTP_SECRET && !!process.env.SESSION_SECRET;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2 text-fg">
          <ShieldCheck className="h-5 w-5 text-accent" />
          <span className="text-sm font-bold">Opportunity Intelligence Engine</span>
        </div>

        {!configured && (
          <div className="card mb-4 border-warn/40 text-xs text-warn">
            Auth is not fully configured. Set <code>OPERATOR_PASSWORD</code>, <code>TOTP_SECRET</code> and{" "}
            <code>SESSION_SECRET</code> (run <code>npm run auth:setup</code> to generate them), then redeploy.
          </div>
        )}

        <form action={login} className="card space-y-4">
          <h1 className="text-lg font-semibold text-fg">Sign in</h1>
          {searchParams.error && (
            <p className="text-sm text-bad">Incorrect password or code. Try again.</p>
          )}
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" className="input" autoComplete="current-password" required />
          </div>
          <div>
            <label className="label">Authenticator code (2FA)</label>
            <input name="code" inputMode="numeric" pattern="[0-9 ]*" className="input tracking-widest" placeholder="123 456" autoComplete="one-time-code" required />
          </div>
          <button className="btn-primary w-full">Sign in</button>
          <p className="text-xs text-subtle">Two factors required: your password and the 6-digit code from your authenticator app.</p>
        </form>
      </div>
    </div>
  );
}
