import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// next-auth imports and types
import { session, token, user } from '@/app/types/index';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { NextAuthOptions } from 'next-auth';
import prisma from "./prisma";

export const NEXT_AUTH: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        Email: { label: 'Email', type: 'text', placeholder: '' },
        Password: { label: 'Password', type: 'password', placeholder: '' }
      },
      async authorize(credentials: any) {
        console.log("Credentials",credentials.Email); 
        //Logic to check user in db
        const user = await prisma.user.findUnique({
          where:{
            email:credentials.Email as string
          }
        });
        if(user){
          console.log(user);
          return {
            id: user.id,
            email:user.email
          }
        }
        return null;
    },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    // })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({token,user}) {
      const newToken = token as token;
        if(user){
          newToken.email = user.email || ''
          newToken.id = user.id
          return newToken;
        }
        return token;
    },
  },
  // pages: {
  //   signIn: "/signin"
  // }
};
