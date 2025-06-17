import React from "react";

const TrendingPodcastsSkeleton = () => {
  return (
    <div className="flex gap-2 md:gap-8 lg:gap-10 xl:gap-12 no-scrollbar overflow-x-hidden">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="aspect-square bg-gray-400 animate-pulse w-[140px] md:w-[160px] lg:w-[180px] xl:w-[190px] 2xl:w-[200px] rounded-xl" />
          <div className="flex flex-col 2xl:max-w-[200px] gap-2">
            <div className="h-2.5 w-1/2 bg-gray-400 animate-pulse rounded-lg" />
            <div className="h-2.5 w-3/4 bg-gray-400 animate-pulse rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingPodcastsSkeleton;
