
//app/components/Headers.tsx
'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { GoogleSignInButton } from './authButtons';
export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href="/" className="text-xl font-bold">
        WhoTube
      </Link>
      <nav className="flex gap-4 items-center">
        {session ? (
          <>
            <Link href="/upload" className="hover:text-gray-300">
              Upload Video
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
          </> 
        )}
      </nav>
    </header>
  );
}
