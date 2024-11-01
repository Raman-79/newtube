import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface Video {
    id: string;
    title: string;
    description: string;
    videoFile: string| null;
    userId: string;
    createdAt: Date;
  }
  export interface session extends Session {
    user: {
      id: string;
      jwtToken: string;
      role: string;
      email: string;
      name: string;
    };
  }

  export interface token extends JWT {
    id:string;
    email:string;
  }

  export interface user {
    id: string;
    name: string;
    email: string;
    token: string;
  }
  