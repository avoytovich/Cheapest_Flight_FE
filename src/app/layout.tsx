import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Geist, Geist_Mono } from 'next/font/google';

import { GeneralProvider } from '@/context/GeneralContext';
import SideNavigation from '@/components/SideNavigation';
import Footer from '@/components/Footer';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Departure Countries',
  description: 'Browse airports by departure country.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-600 to-yellow-600 min-h-screen`}
      >
        <GeneralProvider>
          <SideNavigation>{children}</SideNavigation>
          <Footer />
        </GeneralProvider>
        <Analytics />
      </body>
    </html>
  );
}
