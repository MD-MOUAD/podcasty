import React from 'react';

const PodcastsGridSkeleton = () => {
  return (
    <div className="podcast_grid">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="aspect-square h-fit w-full animate-pulse rounded-xl bg-gray-400 2xl:size-[200px]" />
          <div className="flex h-[42px] flex-col gap-2 2xl:max-w-[200px]">
            <div className="mt-1 h-2.5 w-1/2 animate-pulse rounded-lg bg-gray-400" />
            <div className="h-2 w-3/4 animate-pulse rounded-lg bg-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PodcastsGridSkeleton;
