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
 
  export interface user {
    id: string;
    name: string;
    email: string;
    token: string;
  }
  