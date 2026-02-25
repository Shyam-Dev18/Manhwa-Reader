import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import RateLimit from "@/models/RateLimit";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

async function incrementRateLimit(ip: string) {
  const rateLimit = await RateLimit.findOneAndUpdate(
    { ip },
    { $inc: { attempts: 1 } },
    { upsert: true, new: true }
  );

  if (rateLimit.attempts >= MAX_LOGIN_ATTEMPTS) {
    await RateLimit.updateOne(
      { ip },
      { $set: { lockUntil: new Date(Date.now() + LOCK_TIME_MS) } }
    );
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        await dbConnect();

        const forwardedFor = req?.headers?.["x-forwarded-for"];
        const ip =
          Array.isArray(forwardedFor) && forwardedFor.length > 0
            ? forwardedFor[0].trim()
            : typeof forwardedFor === "string"
            ? forwardedFor.split(",")[0].trim()
            : "unknown-ip";

        if (ip !== "unknown-ip") {
          const rateLimit = await RateLimit.findOne({ ip });
          if (rateLimit && rateLimit.lockUntil && rateLimit.lockUntil > new Date()) {
            throw new Error("Too many login attempts. Please try again later.");
          }
        }

        const user = await User.findOne({ email })
          .select({ email: 1, passwordHash: 1, role: 1, _id: 1 })
          .lean<{
            _id: { toString(): string };
            email: string;
            passwordHash: string;
            role: "admin" | "user";
          } | null>();

        if (!user) {
          if (ip !== "unknown-ip") {
            await incrementRateLimit(ip);
          }
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
          if (ip !== "unknown-ip") {
            await incrementRateLimit(ip);
          }
          return null;
        }

        if (ip !== "unknown-ip") {
          await RateLimit.deleteOne({ ip });
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role =
          token.role === "admin" || token.role === "user" ? token.role : "user";
      }

      return session;
    },
  },
};
