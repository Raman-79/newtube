//NOTE: Can add GoogleAnalytics
// app/layout.tsx
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
  return (
    <html lang="en">
       <SessionProviderAuth>
        <body className={inter.className}>
          <Header/>
            {children}
         </body>
        </SessionProviderAuth>
    </html>
  );
}