// src/lib/nextauth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "./mongoose";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectMongo();

          const admin = await Admin.findOne({
            email: credentials.email.trim(),
          }).select("+password");

          if (!admin || admin.role !== "admin") {
            throw new Error("CredentialsSignin");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);
          if (!isPasswordValid) {
            throw new Error("CredentialsSignin");
          }

          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name || admin.email,
            role: "admin",
            accessToken: admin.accessToken,
            workbooks: admin.workbooks?.map((id: any) => id.toString()) || [],
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("CredentialsSignin");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.workbooks = user.workbooks;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as "admin";
        session.user.accessToken = token.accessToken as string;
        session.user.workbooks = token.workbooks as string[];
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};