'use client';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useAudio } from '@/providers/AudioProvider';

const LeftSidebar = () => {
  const pathname = usePathname();
  const { audio } = useAudio();

  return (
    <section
      className={cn('left_sidebar h-[calc(100vh-5px)]', {
        'h-[calc(100vh-120px)]': audio?.audioUrl,
      })}
    >
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-1 pb-10 max-lg:pl-4"
        >
          <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-16 lg:text-24 text-white font-extrabold">
            Podcasty
          </h1>
        </Link>

        {sidebarLinks.map(({ route, label, icon }) => {
          const isActive =
            pathname === route || pathname.startsWith(`${route}/`);
          const Icon = icon;
          return (
            <Link
              href={route}
              key={label}
              className={cn(
                'flex items-center gap-3 py-4 font-semibold opacity-70 max-lg:px-4',
                {
                  'rounded-[4px] border-r-4 border-orange-1 bg-nav-focus opacity-100':
                    isActive,
                }
              )}
            >
              <Icon isActive={isActive} width={24} height={24} />
              <p>{label}</p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default LeftSidebar;
