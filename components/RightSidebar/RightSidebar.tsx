"use client";

// import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getTopPodcasters } from "@/lib/actions/user.actions";
import Header from "../Header";
import { TopPodcaster } from "@/lib/actions/shared.types";
import { useAudio } from "@/providers/AudioProvider";
import UserAvatar from "./UserAvatar";
import FansRecommendationCarousel from "./FansRecommendationCarousel";
import TestWaterFall from "./TestWaterFall";
import Image from "next/image";

const RightSidebar = () => {
  // const router = useRouter();
  const [topPodcasters, setTopPodcasters] = useState<TopPodcaster[]>([]);

  useEffect(() => {
    const loadTopPodcasters = async () => {
      try {
        const data = await getTopPodcasters(5);
        setTopPodcasters(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadTopPodcasters();
  }, []);

  const { audio } = useAudio();
  const router = useRouter();

  return (
    <section
      className={cn(
        "right_sidebar no-scrollbar h-[calc(100vh-5px)] transition-all duration-500 ease-in-out",
        {
          "h-[calc(100vh-120px)]": audio?.audioUrl,
        }
      )}
    >
      <UserAvatar />
      <section>
        <Header headerTitle="Fans Also Like" />
        <div className="mt-2" />
        <FansRecommendationCarousel />
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
                  priority
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
