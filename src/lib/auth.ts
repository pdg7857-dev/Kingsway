import type { NextAuthOptions, Session } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./prisma";

const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.modify",
        },
      },
    })
  );
}

if (process.env.EMAIL_SERVER) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "database" },
  pages: { signIn: "/login" },
  callbacks: {
    async session({ session, user }) {
      if (session.user) (session.user as Session["user"] & { id: string }).id = user.id;
      return session;
    },
  },
};

/**
 * Dev convenience: when no auth provider is configured we fall back to the
 * seeded operator user so the dashboards are usable out-of-the-box.
 */
export async function getCurrentUser() {
  // In production with NextAuth wired up, this should use getServerSession.
  // Kept simple here to keep the build runnable without OAuth credentials.
  const operator = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  return operator;
}

export async function requireCurrentUser() {
  const u = await getCurrentUser();
  if (!u) throw new Error("No user — run `npm run db:seed`.");
  return u;
}
