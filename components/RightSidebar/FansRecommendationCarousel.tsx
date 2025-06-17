import { TopPodcaster } from '@/lib/actions/shared.types';
import { getTopPodcasters } from '@/lib/actions/user.actions';
import { useState, useEffect } from 'react';
import Carousel from '@/components/RightSidebar/Carousel';

export const FansCarouselSkeleton = () => {
  return (
    <div className="flex h-[276px] w-full flex-col items-center gap-4">
      <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-400" />
      <div className="h-2.5 w-20 animate-pulse rounded bg-gray-400" />
    </div>
  );
};

const FansRecommendationCarousel = () => {
  const [data, setData] = useState<TopPodcaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getTopPodcasters(5);
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <FansCarouselSkeleton />;
  }

  return <Carousel fansLikeDetail={data} />;
};

export default FansRecommendationCarousel;
