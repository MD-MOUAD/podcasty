const LatestPodcastsSkeleton = () => {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 4 }, (_, i) => {
        return (
          <div key={i}>
            <div className="flex">
              <div className="flex w-2/3 items-center gap-6 sm:w-1/2">
                {/* Podcast name and thumbnail */}
                <div className="w-2" />
                <div className="h-[54px] w-[52px] animate-pulse rounded-md bg-gray-400" />
                <div className="h-2.5 w-28 animate-pulse rounded-md bg-gray-400 lg:w-32" />
              </div>
              <div className="flex w-1/3 items-center max-sm:justify-between sm:w-1/2">
                <div className="w-2/5">
                  {/* Podcast views */}
                  <div className="h-2.5 w-20 animate-pulse rounded-md bg-gray-400" />
                </div>
                <div className="hidden w-2/5 sm:flex">
                  {/* Podcast duration */}
                  <div className="h-2.5 w-24 animate-pulse rounded-md bg-gray-400" />
                </div>

                <div className="sm:w-1/5">
                  {/* Tree dots */}
                  <div className="ml-auto mr-1 h-2.5 w-8 animate-pulse rounded-md bg-gray-400" />
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

export default LatestPodcastsSkeleton;
