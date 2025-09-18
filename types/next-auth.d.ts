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
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    plan: string;
    dailyViews: number;
    bonusViews: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan: string;
    dailyViews: number;
    bonusViews: number;
  }
}
