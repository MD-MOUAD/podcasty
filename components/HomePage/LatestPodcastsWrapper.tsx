import { getTrendingPodcasts } from "@/lib/actions/podcast.actions";
import { formatDuration } from "@/lib/formatTime";
import { IPodcast } from "@/lib/models/Podcast";
import Image from "next/image";
import React from "react";

const LatestPodcastsWrapper = async () => {
  const data = await getTrendingPodcasts(4);
  const latestPodcasts: IPodcast[] = JSON.parse(JSON.stringify(data));
  return (
    <div className="flex flex-col">
      {latestPodcasts.map((podcast, i) => {
        return (
          <div key={podcast._id.toString()}>
            <div className="flex cursor-default">
              <div className="w-1/2 flex items-center gap-6 group transition-colors duration-500 hover:cursor-default">
                {/* Podcast name and thumbnail */}
                <span className="w-2 text-center text-white-1 font-bold text-16 group-hover:text-orange-1">
                  {i + 1}
                </span>
                <div className="relative overflow-hidden w-[52px] rounded-md h-[54px] aspect-square">
                  <Image
                    src={podcast.imageUrl as string}
                    alt={podcast.title}
                    fill
                    className="object-cover object-center brightness-[0.8] group-hover:brightness-100 w-full cursor-pointer"
                  />
                </div>
                <p className="font-bold text-16 text-white-1 truncate group-hover:text-orange-1 max-w-44">
                  {podcast.title}
                </p>
              </div>
              <div className="w-1/2 flex items-center">
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
                <div className="w-2/5 flex items-center gap-2.5">
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
                <div className="w-1/5">
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

export default LatestPodcastsWrapper;
