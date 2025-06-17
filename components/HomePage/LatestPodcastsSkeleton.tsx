const LatestPodcastsSkeleton = () => {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 4 }, (_, i) => {
        return (
          <div key={i}>
            <div className="flex">
              <div className="w-1/2 flex items-center gap-6">
                {/* Podcast name and thumbnail */}
                <div className="w-2" />
                <div className="w-[52px] h-[54px] rounded-md bg-gray-400 animate-pulse" />
                <div className="h-2.5 w-32 bg-gray-400 animate-pulse rounded-md" />
              </div>
              <div className="w-1/2 flex items-center">
                <div className="w-2/5">
                  {/* Podcast views */}
                  <div className="h-2.5 w-20 bg-gray-400 animate-pulse rounded-md" />
                </div>
                <div className="w-2/5">
                  {/* Podcast duration */}
                  <div className="h-2.5 w-24 bg-gray-400 animate-pulse rounded-md" />
                </div>

                <div className="w-1/5">
                  {/* Tree dots */}
                  <div className="h-2.5 w-8 ml-auto mr-1 bg-gray-400 animate-pulse rounded-md" />
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

export default LatestPodcastsSkeleton;
