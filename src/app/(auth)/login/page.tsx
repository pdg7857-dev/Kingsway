import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-dvh grid place-items-center px-6">
      <div className="panel relative w-full max-w-md p-8 scanline">
        <div className="flex items-center gap-2 mb-6">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accent to-violet shadow-[0_0_20px_-4px_hsl(186_100%_55%_/_0.6)]">
            <span className="font-mono text-[10px] font-bold text-bg">OS</span>
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold text-gradient-accent">CEO Command OS</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Operating System</div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-1">Welcome back, Operator</h1>
        <p className="text-sm text-fg-muted mb-6">
          Sign in to your master command. Set <code>GOOGLE_CLIENT_ID</code> in env to enable Google sign-in.
        </p>

        <form action="/api/auth/signin/google" method="post" className="space-y-3">
          <button
            className="w-full rounded-lg bg-accent text-bg px-4 py-2.5 text-sm font-medium hover:bg-accent-glow"
            type="submit"
          >
            Continue with Google
          </button>
        </form>

        <div className="mt-6 text-xs text-fg-subtle flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-accent" />
          <span>Dev mode falls back to the seeded operator. <Link href="/" className="underline">Enter dashboard</Link></span>
        </div>
      </div>
    </div>
  );
}
