import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 8081,
  dbUrl: process.env.DATABASE_URL,
};