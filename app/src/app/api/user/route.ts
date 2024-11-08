import prisma from "@database/index";
import bcrypt from 'bcrypt';
import { SignJWT, importJWK } from 'jose';
import { NextResponse } from "next/server";

const generateJWT = async (email: string, name: string) => {
  const secret = process.env.NEXTAUTH_SECRET || 'secret';
  const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });
  const JWTPayload = { email, name };

  const jwt = await new SignJWT(JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('365d')
    .sign(jwk);

  return jwt;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    // Hash password and generate JWT token
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = await generateJWT(email, name);

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        access_token: token,
      }
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const password = url.searchParams.get('password');

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find the user in the database
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
