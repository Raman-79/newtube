// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser, JWT } from "next-auth";

// Extend user object to include id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]; // Include default fields (name, email, image)
    accessToken?: string; // Add custom accessToken field
    refreshToken?:string;
  }

  interface User extends DefaultUser {
    id: string; // Include user ID
    email:string;
    password:string;

  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // Add id to JWT token
    accessToken?: string; // Add accessToken to JWT token
  }
}
