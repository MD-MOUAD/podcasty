import { TopPodcaster } from "@/lib/actions/shared.types";
import { getTopPodcasters } from "@/lib/actions/user.actions";
import { useState, useEffect } from "react";
import Carousel from "@/components/RightSidebar/Carousel";

export const FansCarouselSkeleton = () => {
  return (
    <div className="flex w-full h-[276px] flex-col gap-4 items-center">
      <div className="w-full aspect-square rounded-lg bg-gray-400 animate-pulse" />
      <div className="bg-gray-400 animate-pulse h-2.5 w-20 rounded" />
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
