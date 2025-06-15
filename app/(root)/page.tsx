import PodcastCard from "@/components/PodcastCard";
import { getTrendingPodcasts } from "@/lib/actions/getTrendingPodcasts";

const Home = async () => {
  const trendingPodcasts = await getTrendingPodcasts();

  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
        <div className="podcast_grid">
          {trendingPodcasts?.map(({ _id, title, description, imageUrl }) => (
            <PodcastCard
              key={_id.toString()}
              imgUrl={imageUrl}
              title={title}
              description={description}
              podcastId={_id.toString()}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
