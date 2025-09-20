import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "admin" | "user";
      accessToken?: string;
      workbooks?: string[];
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "admin" | "user";
    accessToken?: string;
    workbooks?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "admin" | "user";
    accessToken?: string;
    workbooks?: string[];
  }
}
