// app/layout.tsx
'use client'
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import SessionProviderAuth from './components/sessionProvider';
import Header from './components/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved preference or system preference
  useEffect(() => {
    const darkModePreference =
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(darkModePreference);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <html lang="en">
      <SessionProviderAuth>
        <body className={`${inter.className} ${isDarkMode ? 'dark' : ''}`}>
          <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
          {children}
        </body>
      </SessionProviderAuth>
    </html>
  );
}
