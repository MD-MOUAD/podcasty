import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import ClerkProvider from '@/providers/ClerkProvider';
import AudioProvider from '@/providers/AudioProvider';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Podcasty',
  description:
    'Podcasty lets you effortlessly generate engaging podcasts using AI. Turn ideas into audio content in seconds.',
  icons: {
    icon: '/icons/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <AudioProvider>
          <body className={`${manrope.className} antialiased`}>{children}</body>
        </AudioProvider>
      </html>
    </ClerkProvider>
  );
}
