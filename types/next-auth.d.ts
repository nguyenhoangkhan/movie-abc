import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      plan: string;
      dailyViews: number;
      bonusViews: number;
      premiumUntil: Date | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    plan: string;
    dailyViews: number;
    bonusViews: number;
    premiumUntil: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan: string;
    dailyViews: number;
    bonusViews: number;
    premiumUntil: Date | null;
  }
}
