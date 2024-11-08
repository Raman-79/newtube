// app/components/Header.tsx
'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import AuthButton from '@/app/components/AuthButton';
import React from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header
      className={`flex justify-between items-center p-4 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      } bg-gradient-to-r from-indigo-500`}
    >
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
              className={`${
                isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
              } px-4 py-2 rounded`}
            >
              Sign Out
            </button>
          </>
        ) : (
          <AuthButton />
        )}
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 text-white"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </nav>
    </header>
  );
}
