import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/db";
import { accounts, authenticators, sessions, users, verificationTokens } from "@/db/schema";

const allowedGoogleDomains = new Set(
  (process.env.AUTH_ALLOWED_GOOGLE_DOMAINS ?? "")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean),
);

if (process.env.NODE_ENV === "production" && !process.env.AUTH_URL && !process.env.NEXTAUTH_URL) {
  throw new Error("AUTH_URL (or NEXTAUTH_URL) must be set in production");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") {
        return false;
      }

      const email = typeof profile?.email === "string" ? profile.email.toLowerCase() : "";
      const emailVerified = profile?.email_verified === true;

      if (!email || !emailVerified) {
        return false;
      }

      if (allowedGoogleDomains.size === 0) {
        return true;
      }

      const domain = email.split("@").at(1);
      return !!domain && allowedGoogleDomains.has(domain);
    },
  },
  session: {
    strategy: "database",
  },
});
