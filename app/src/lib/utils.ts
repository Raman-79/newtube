import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { NextAuthOptions } from 'next-auth';
import prisma from '@database/index';

export const NEXT_AUTH: NextAuthOptions = {

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        Email: { label: 'Email', type: 'text', placeholder: '' },
        Password: { label: 'Password', type: 'password', placeholder: '' }
      },
      async authorize(credentials: any) {
        if (!credentials?.Email || !credentials?.Password) {
          return null;
        }
        const res = await fetch(
          `http://localhost:3000/api/user?email=${credentials.Email}&password=${credentials.Password}`,        
        );
        const data = await res.json() ;
       
        if(res.ok && data.user){
          console.log(data.user);
          return data.user;
        }
        else return null;
     },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   authorization: {
    //     params: {
    //       prompt: "consent",
    //       access_type: "offline",
    //       response_type: "code"
    //     }
    //   }
    // })
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  
  callbacks: {
    // async signIn({account,profile}){
    //     if(!profile || !account) return false;
    //     if(account?.provider === "google"){
    //       const email = profile.email;
    //       const user = await prisma.user.findFirst({where: {email}});
    //       if(!user){
    //       await prisma.user.create({
    //           data:{
    //             name:profile?.name as string,
    //             email: profile?.email as string,
    //             password: '',
    //             access_token:account.access_token as string,
    //             authProvider:"GOOGLE"
    //           }
    //        }).catch((err)=>{
    //         console.log("Error adding user to the db", err.message);
    //         return false;
    //        })
    //       }
          
    //     }
    //     return true;
    // },
    async jwt({ token, user }:any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }:any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session; 
    }
  },
  /*
  For custom sigin
  pages:{
    signin: "/signin"
  }
    */
}
