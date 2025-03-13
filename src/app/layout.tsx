import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Geist, Geist_Mono } from 'next/font/google';

import { GeneralProvider } from '@/context/GeneralContext';
import TrackSteps from '@/components/TrackSteps';
import TrackChoise from '@/components/TrackChoise';
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased bg-gradient-to-br from-blue-600 to-yellow-600`}
      >
        <div className="flex flex-col flex-grow">
          <GeneralProvider>
            <TrackSteps />
            <div className="flex-grow flex">
              <div className="flex-grow flex justify-center items-center">
                {children}
              </div>
            </div>
            <TrackChoise />
          </GeneralProvider>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
