import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { GeneralProvider } from '@/context/GeneralContext';
import SideNavigation from '@/components/SideNavigation';

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
        </GeneralProvider>
      </body>
    </html>
  );
}
