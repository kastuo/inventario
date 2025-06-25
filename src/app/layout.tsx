'use client';
import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import Header from '../app/components/Header';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans bg-gray-50">
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}