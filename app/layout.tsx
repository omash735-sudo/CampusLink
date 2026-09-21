// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ConditionalChrome } from '@/components/ConditionalChrome';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CampusLink | Connect. Discover. Belong.',
  description: 'Your digital community for LUANAR City Campus',
  icons: {
    icon: 'https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png',
    apple: 'https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white`}>
        <ConditionalChrome>{children}</ConditionalChrome>
      </body>
    </html>
  );
}
