import React from "react";

const PodcastsGridSkeleton = () => {
  return (
    <div className="podcast_grid">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="bg-gray-400 animate-pulse  h-fit w-full 2xl:size-[200px] aspect-square rounded-xl" />
          <div className="flex flex-col 2xl:max-w-[200px] gap-2 h-[42px]">
            <div className="h-2.5 w-1/2 bg-gray-400 animate-pulse rounded-lg mt-1" />
            <div className="h-2 w-3/4 bg-gray-400 animate-pulse rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PodcastsGridSkeleton;
