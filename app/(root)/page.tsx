import PodcastsSlider from "@/components/PodcastsSlider";
import { getTrendingPodcasts } from "@/lib/actions/podcast.actions";

const Home = async () => {
  const trendingPodcasts = await getTrendingPodcasts();

  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
        <PodcastsSlider
          podcasts={JSON.parse(JSON.stringify(trendingPodcasts))}
        />
      </section>
    </div>
  );
};

export default Home;
