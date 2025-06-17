"use client";

import { formatDuration } from "@/lib/formatTime";
import { IPodcast } from "@/lib/models/Podcast";
import { IUser } from "@/lib/models/User";
import { useAudio } from "@/providers/AudioProvider";
import { LatestPodcastsProps } from "@/types";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const LatestPodcasts = ({ latestPodcastsData }: LatestPodcastsProps) => {
  const { setAudio } = useAudio();
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const handlePlay = (podcast: IPodcast, active: number) => {
    const author = podcast.userId as IUser;
    setAudio({
      title: podcast.title,
      audioUrl: podcast.audioUrl,
      imageUrl: podcast.imageUrl,
      authorClerkId: podcast.authorClerkId,
      podcastId: podcast._id?.toString(),
      author: author.name,
    });
    setActiveIndex(active);
  };

  return (
    <div className="flex flex-col">
      {latestPodcastsData.map((podcast, i) => {
        const isActive = activeIndex === i;
        return (
          <div key={podcast._id.toString()}>
            <div className="flex cursor-default">
              <div className="w-2/3 sm:w-1/2 flex items-center gap-6 group transition-colors duration-500 hover:cursor-default">
                {/* Podcast name and thumbnail */}
                <div
                  className={`relative w-2 text-center font-bold text-16 group-hover:text-orange-1 ${
                    isActive ? "text-orange-1" : "text-white-1"
                  }`}
                >
                  <span className="group-hover:hidden">{i + 1}</span>
                  <Play
                    className="hidden group-hover:flex size-4"
                    fill="#F97535"
                  />
                </div>
                <div className="relative overflow-hidden w-[52px] rounded-md h-[54px] aspect-square">
                  <Image
                    src={podcast.imageUrl as string}
                    alt={podcast.title}
                    fill
                    className={`object-cover object-center brightness-[0.8] group-hover:brightness-100 w-full ${
                      isActive ? "brightness-100" : "brightness-[0.8]"
                    }`}
                    onClick={() => handlePlay(podcast, i)}
                  />
                </div>
                <Link
                  href={`/podcasts/${podcast._id}`}
                  className={`font-bold text-16 truncate group-hover:text-orange-1 hover:underline max-w-32 lg:max-w-44 cursor-pointer ${
                    isActive ? "text-orange-1" : "text-white-1"
                  }`}
                >
                  {podcast.title}
                </Link>
              </div>
              <div className="w-1/3 sm:w-1/2 flex max-sm:justify-between items-center">
                <div className="w-2/5 flex items-center gap-2.5">
                  {/* Podcast views */}

                  <Image
                    src="/icons/headphone.svg"
                    alt="headphone"
                    height={24}
                    width={24}
                  />
                  <span className="text-white-1 font-bold text-16 flex items-center justify-center">
                    {podcast.views}
                  </span>
                </div>
                <div className="w-2/5 hidden sm:flex items-center gap-2.5">
                  {/* Podcast duration */}
                  <Image
                    src="/icons/watch.svg"
                    alt="duration"
                    height={24}
                    width={24}
                  />
                  <span className="text-white-1 font-bold text-16 flex items-center justify-center">
                    {formatDuration(podcast.duration)}
                  </span>
                </div>
                <div className="sm:w-1/5">
                  {/* Tree dots */}
                  <div className="p-1 size-fit ml-auto mr-1 rounded-full hover:bg-gray-500/10 hover:shadow-sm hover:shadow-white-1/50 transition-all duration-300">
                    <Image
                      src="/icons/three-dots.svg"
                      alt="more"
                      height={28}
                      width={28}
                      className="rotate-90 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
            {i < 4 - 1 && (
              <div className="h-[1px] bg-gray-1/50 ml-8 my-6 rounded-lg" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LatestPodcasts;
