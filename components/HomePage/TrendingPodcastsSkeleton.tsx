import React from 'react';

const TrendingPodcastsSkeleton = () => {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-hidden md:gap-8 lg:gap-10 xl:gap-12">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="aspect-square w-[140px] animate-pulse rounded-xl bg-gray-400 md:w-[160px] lg:w-[180px] xl:w-[190px] 2xl:w-[200px]" />
          <div className="flex h-[42px] flex-col gap-2 2xl:max-w-[200px]">
            <div className="mt-1 h-2.5 w-1/2 animate-pulse rounded-lg bg-gray-400" />
            <div className="h-2 w-3/4 animate-pulse rounded-lg bg-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingPodcastsSkeleton;
