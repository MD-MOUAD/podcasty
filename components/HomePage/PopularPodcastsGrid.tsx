import { getTrendingPodcasts } from '@/lib/actions/podcast.actions';
import { IPodcast } from '@/lib/models/Podcast';
import React from 'react';
import PodcastCard from '@/components/PodcastCard';

const PopularPodcastsGrid = async () => {
  const data = await getTrendingPodcasts(20);
  const popularPodcasts: IPodcast[] = JSON.parse(JSON.stringify(data));
  return (
    <div className="podcast_grid">
      {popularPodcasts?.map(({ _id, title, description, imageUrl }) => (
        <PodcastCard
          key={_id.toString()}
          imgUrl={imageUrl!}
          title={title}
          description={description}
          podcastId={_id.toString()}
        />
      ))}
    </div>
  );
};

export default PopularPodcastsGrid;
