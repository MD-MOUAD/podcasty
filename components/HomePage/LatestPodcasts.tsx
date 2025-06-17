'use client';

import { formatDuration } from '@/lib/formatTime';
import { IPodcast } from '@/lib/models/Podcast';
import { IUser } from '@/lib/models/User';
import { useAudio } from '@/providers/AudioProvider';
import { LatestPodcastsProps } from '@/types';
import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

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
              <div className="group flex w-2/3 items-center gap-4 transition-colors duration-500 hover:cursor-default sm:w-1/2 md:gap-6">
                {/* Podcast name and thumbnail */}
                <div
                  className={`text-12 md:text-16 relative w-2 text-center font-bold group-hover:text-orange-1 ${
                    isActive ? 'text-orange-1' : 'text-white-1'
                  }`}
                >
                  <span className="group-hover:hidden">{i + 1}</span>
                  <Play
                    className="hidden size-4 group-hover:flex"
                    fill="#F97535"
                  />
                </div>
                <div className="relative aspect-square h-[54px] w-[52px] overflow-hidden rounded-md">
                  <Image
                    src={podcast.imageUrl as string}
                    alt={podcast.title}
                    fill
                    className={`w-full object-cover object-center brightness-[0.8] group-hover:brightness-100 ${
                      isActive ? 'brightness-100' : 'brightness-[0.8]'
                    }`}
                    onClick={() => handlePlay(podcast, i)}
                  />
                </div>
                <Link
                  href={`/podcasts/${podcast._id}`}
                  className={`text-12 md:text-16 max-w-28 cursor-pointer truncate font-bold hover:underline group-hover:text-orange-1 lg:max-w-44 ${
                    isActive ? 'text-orange-1' : 'text-white-1'
                  }`}
                >
                  {podcast.title}
                </Link>
              </div>
              <div className="flex w-1/3 items-center max-sm:justify-between sm:w-1/2">
                <div className="flex w-2/5 items-center gap-2.5">
                  {/* Podcast views */}
                  <Image
                    src="/icons/headphone.svg"
                    alt="headphone"
                    height={24}
                    width={24}
                    className="max-md:size-4"
                  />
                  <p className="text-12 sm:text-16 mt-1 font-bold text-white-1">
                    {podcast.views}
                  </p>
                </div>
                <div className="hidden w-2/5 items-center gap-2.5 sm:flex">
                  {/* Podcast duration */}
                  <Image
                    src="/icons/watch.svg"
                    alt="duration"
                    height={24}
                    width={24}
                  />
                  <span className="text-16 flex items-center justify-center font-bold text-white-1">
                    {formatDuration(podcast.duration)}
                  </span>
                </div>
                <div className="sm:w-1/5">
                  {/* Tree dots */}
                  <div className="ml-auto mr-1 size-fit rounded-full p-1 transition-all duration-300 md:shadow-sm md:hover:bg-gray-500/10 md:hover:shadow-white-1/50">
                    <Image
                      src="/icons/three-dots.svg"
                      alt="more"
                      height={28}
                      width={28}
                      className="rotate-90 cursor-pointer max-md:size-5"
                    />
                  </div>
                </div>
              </div>
            </div>
            {i < 4 - 1 && (
              <div className="my-6 ml-8 h-[1px] rounded-lg bg-gray-1/50" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LatestPodcasts;
