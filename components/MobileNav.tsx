'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { SignedIn, useClerk } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import UserAvatar from './RightSidebar/UserAvatar';

const MobileNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-black-1">
          <div className="mb-32 mt-4">
            <UserAvatar />
          </div>
          <div className="flex h-[50vh] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav className="flex h-full flex-col justify-between text-white-1">
                <div className="flex flex-col gap-6">
                  {sidebarLinks.map(({ route, label, icon }) => {
                    const isActive =
                      pathname === route || pathname.startsWith(`${route}/`);
                    const Icon = icon;
                    return (
                      <SheetClose asChild key={route}>
                        <Link
                          href={route}
                          className={cn(
                            'flex items-center justify-start gap-3 py-4 max-lg:px-4',
                            {
                              'border-r-4 border-orange-1 bg-nav-focus':
                                isActive,
                            }
                          )}
                        >
                          <Icon isActive={isActive} width={24} height={24} />
                          <p>{label}</p>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
                <div className="mb-20">
                  <SignedIn>
                    <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
                      <Button
                        className="text-16 w-full bg-orange-1 font-extrabold"
                        onClick={() => signOut(() => router.push('/'))}
                      >
                        Log Out
                      </Button>
                    </div>
                  </SignedIn>
                </div>
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
