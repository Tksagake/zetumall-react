import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "./db";
import { NextAuthOptions, Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Fetch user from Supabase
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (!user || error) throw new Error("User not found.");

        // Verify password (assuming plaintext for now)
        if (user.password !== credentials.password) {
          throw new Error("Invalid credentials.");
        }

        // Return user object for session
        return {
          id: user.id,
          email: user.email,
          role: user.role, // Either 'admin' or 'customer'
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        if (session.user) {
          if (typeof token.sub === 'string') {
            session.user.id = token.sub;
          }
        }
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
