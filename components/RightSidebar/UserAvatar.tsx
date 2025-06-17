import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const UserAvatar = () => {
  const { isLoaded } = useUser();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex gap-3 mb-11 min-h-8">
        <div className="size-7 shrink-0 animate-pulse rounded-full bg-gray-400" />
        <div className="flex w-full items-center justify-between">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-400" />
          <Image
            src="/icons/right-arrow.svg"
            alt="arrow"
            width={22}
            height={22}
          />
        </div>
      </div>
    );
  }

  return (
    <Link href={`/profile/${user?.id}`} className="flex gap-3 mb-11 min-h-7">
      <div className="size-8 shrink-0">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: {
                width: "28px",
                height: "28px",
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
  );
};

export default UserAvatar;
