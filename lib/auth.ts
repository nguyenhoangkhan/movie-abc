import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { shouldResetDailyViews } from "@/lib/utils";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Check if daily views need to be reset
        if (shouldResetDailyViews(user.lastViewReset)) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              dailyViews: 0,
              lastViewReset: new Date(),
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          dailyViews: user.dailyViews,
          bonusViews: user.bonusViews,
          premiumUntil: user.premiumUntil,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.plan = user.plan;
        token.dailyViews = user.dailyViews;
        token.bonusViews = user.bonusViews;
        token.premiumUntil = user.premiumUntil;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.plan = token.plan as string;
        session.user.dailyViews = token.dailyViews as number;
        session.user.bonusViews = token.bonusViews as number;
        session.user.premiumUntil = token.premiumUntil as Date | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
