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
  title: 'Flexible Ryanair',
  description: 'Combines trip planning with flexible date options',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Find the Cheapest Flights | Cheapest Flight Finder',
    description:
      'Combines trip planning with flexible date options to find the cheapest flights',
    type: 'website',
    url: 'https://cheapest-flight-fe.vercel.app/',
    siteName: 'Flexible Ryanair',
    images: [
      {
        url: '/ryanair.svg',
        width: 1200,
        height: 630,
        alt: 'Ryanair Logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased bg-gradient-to-br from-blue-600 to-yellow-600 overflow-x-hidden`}
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
