'use client';

import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import { useAudio } from '@/providers/AudioProvider';
import UserAvatar from './UserAvatar';
import FansRecommendationCarousel from './FansRecommendationCarousel';
import TopPodcasters from './TopPodcasters';

const RightSidebar = () => {
  const { audio } = useAudio();

  return (
    <section
      className={cn(
        'right_sidebar no-scrollbar h-[calc(100vh-5px)] overflow-y-auto',
        {
          'h-[calc(100vh-120px)]': audio?.audioUrl,
        }
      )}
    >
      <UserAvatar />
      <section>
        <Header headerTitle="Fans Also Like" />
        <div className="mt-2" />
        <FansRecommendationCarousel />
      </section>
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Podcasters" />
        <TopPodcasters />
      </section>
    </section>
  );
};

export default RightSidebar;
