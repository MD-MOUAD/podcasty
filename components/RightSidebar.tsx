"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getTopPodcasters } from "@/lib/actions/user.actions";
import Header from "./Header";
import { TopPodcaster } from "@/lib/actions/shared.types";
import Carousel from "./Carousel";
import { useAudio } from "@/providers/AudioProvider";

const RightSidebar = () => {
  const { user } = useUser();
  const router = useRouter();
  const [topPodcasters, setTopPodcasters] = useState<TopPodcaster[]>([]);

  useEffect(() => {
    const loadTopPodcasters = async () => {
      const data = await getTopPodcasters(5);
      setTopPodcasters(data);
    };

    loadTopPodcasters();
  }, []);

  const { audio } = useAudio();

  return (
    <section
      className={cn("right_sidebar no-scrollbar h-[calc(100vh-5px)]", {
        "h-[calc(100vh-120px)]": audio?.audioUrl,
      })}
    >
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user?.firstName} {user?.lastName}
            </h1>
            <Image
              src="/icons/right-arrow.svg"
              alt="arrow"
              width={22}
              height={22}
            />
          </div>
        </Link>
      </SignedIn>
      <section>
        <Header headerTitle="Fans Also Like" />
        <div className="mt-2" />
        <Carousel fansLikeDetail={topPodcasters!} />
      </section>
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Podcasters" />
        <div className="flex flex-col gap-6">
          {topPodcasters?.slice(0, 3).map((podcaster) => (
            <div
              key={podcaster.clerkId as string}
              className="flex cursor-pointer justify-between"
              onClick={() => router.push(`/profile/${podcaster.clerkId}`)}
            >
              <figure className="flex items-center gap-2">
                <Image
                  src={podcaster.picture as string}
                  alt={podcaster.name}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-[12px] font-semibold text-white-1">
                  {podcaster.name}
                </h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 font-normal text-white-1">
                  {podcaster.podcastCount} podcasts
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default RightSidebar;
