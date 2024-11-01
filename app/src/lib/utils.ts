import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
export const NEXT_AUTH = {
   providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          Email: { label: 'Email', type: 'text', placeholder: '' },
          Password: {label:'Password',type:'password',placeholder:''}
        },
        async authorize(credentials: any) {
            console.log("Credentials",credentials); 
            //Logic to check user in db
            return {
                id:'1',
                email:credentials.Email
            };
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ user, token }: any) => {
      if (user) {
          token.uid = user.id;
      }
      return token;
    },
  session: ({ session, token, user }: any) => {
      if (session.user) {
          session.user.id = token.uid
      }
      console.log("Session callback", session)
      return session
  }
  },
  /*
  For custom sigin
  pages:{
    signin: "/signin"
  }
    */
}

