import React from 'react';
import PodcastsSlider from '../PodcastsSlider';
import { getTrendingPodcasts } from '@/lib/actions/podcast.actions';

const TrendingPodcastsWrapper = async () => {
  const trendingPodcasts = await getTrendingPodcasts();
  return (
    <PodcastsSlider podcasts={JSON.parse(JSON.stringify(trendingPodcasts))} />
  );
};

export default TrendingPodcastsWrapper;
