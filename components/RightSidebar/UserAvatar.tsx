import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

const UserAvatar = () => {
  const { isLoaded } = useUser();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="mb-11 flex h-8 items-center gap-4">
        <div className="size-7 shrink-0 animate-pulse rounded-full bg-gray-400" />
        <div className="flex w-full items-center justify-between">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <Link
          href={`/profile/${user?.id}`}
          className="mb-11 flex h-8 items-center gap-3"
        >
          <div className="size-8 shrink-0">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: '28px',
                    height: '28px',
                  },
                },
              }}
            />
          </div>
          <div className="flex w-full items-center justify-between overflow-x-hidden">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user?.firstName} {user?.lastName}
            </h1>
            <Image
              src="/icons/right-arrow.svg"
              alt="arrow"
              width={22}
              height={22}
              className="shrink-0"
            />
          </div>
        </Link>
      </SignedIn>
      <SignedOut>
        <div className="mb-11 flex h-8 items-center justify-between">
          <Link href="sign-in">
            <Button className="text-16 py-4.5 h-8 shrink-0 rounded-lg px-8 font-extrabold !text-white-1">
              Login
            </Button>
          </Link>
          <Link
            href="sign-up"
            className="flex w-fit items-center gap-4 opacity-80 hover:opacity-100"
          >
            <span className="text-16 font-semibold text-orange-1">Sign up</span>
            <Image
              src="/icons/right-arrow.svg"
              alt="arrow"
              width={22}
              height={22}
              className="shrink-0"
            />
          </Link>
        </div>
      </SignedOut>
    </>
  );
};

export default UserAvatar;
