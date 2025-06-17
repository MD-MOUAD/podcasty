import LeftSidebar from '@/components/LeftSidebar';
import MobileNav from '@/components/MobileNav';
import PodcastPlayer from '@/components/PodcastPlayer';
import RightSidebar from '@/components/RightSidebar/RightSidebar';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';
import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <main className="relative flex bg-black-3">
        <LeftSidebar />

        <section className="flex min-h-screen min-w-0 flex-1 flex-col sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div className="flex h-16 items-center justify-between md:hidden">
              <Link href="/" className="flex cursor-pointer items-center gap-2">
                <Image
                  src="/icons/logo.svg"
                  alt="logo"
                  width={26}
                  height={30}
                />
                <h1 className="text-24 font-extrabold text-white-1">
                  Podcasty
                </h1>
              </Link>

              <MobileNav />
            </div>
            <div className="flex flex-col md:pb-14">
              <Toaster />
              {children}
            </div>
          </div>
        </section>

        <RightSidebar />
      </main>
      <PodcastPlayer />
    </div>
  );
}
