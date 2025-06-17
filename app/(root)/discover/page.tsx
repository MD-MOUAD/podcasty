import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import Searchbar from "@/components/Searchbar";
import { getTrendingPodcasts } from "@/lib/actions/podcast.actions";

const Discover = async ({
  searchParams: { search },
}: {
  searchParams: { search: string };
}) => {
  const podcastsData = await getTrendingPodcasts(20);

  return (
    <div className="flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? "Discover Trending Podcasts" : "Search results for "}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className="podcast_grid">
                {podcastsData?.map(({ _id, title, description, imageUrl }) => (
                  <PodcastCard
                    key={_id.toString()}
                    imgUrl={imageUrl!}
                    title={title}
                    description={description}
                    podcastId={_id.toString()}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="No results found" />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default Discover;
