import Header from '@/components/Header';
import LatestPodcastsSkeleton from '@/components/HomePage/LatestPodcastsSkeleton';
import LatestPodcastsWrapper from '@/components/HomePage/LatestPodcastsWrapper';
import PodcastsGridSkeleton from '@/components/HomePage/PodcastsGridSkeleton';
import PopularPodcastsGrid from '@/components/HomePage/PopularPodcastsGrid';
import TrendingPodcastsSkeleton from '@/components/HomePage/TrendingPodcastsSkeleton';
import TrendingPodcastsWrapper from '@/components/HomePage/TrendingPodcastsWrapper';
import TopPodcasters from '@/components/RightSidebar/TopPodcasters';
import { Suspense } from 'react';
const Home = async () => {
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-16 md:text-20 font-bold text-white-1">
          Trending Podcasts
        </h1>
        <Suspense fallback={<TrendingPodcastsSkeleton />}>
          <TrendingPodcastsWrapper />
        </Suspense>
      </section>
      <section className="flex flex-col gap-5">
        <Header
          headerTitle={'Latest Podcasts'}
          titleClassName={'!text-16 !md:text-20'}
        />
        <Suspense fallback={<LatestPodcastsSkeleton />}>
          <LatestPodcastsWrapper />
        </Suspense>
      </section>
      <section className="flex flex-col gap-5">
        <h1 className="text-16 md:text-20 font-bold text-white-1">
          Popular Podcasts
        </h1>
        <Suspense fallback={<PodcastsGridSkeleton />}>
          <PopularPodcastsGrid />
        </Suspense>
      </section>
      <section className="flex w-full flex-1 flex-col gap-8 max-sm:px-[30px] xl:hidden">
        <Header headerTitle="Top Podcasters" />
        <TopPodcasters />
      </section>
    </div>
  );
};

export default Home;
