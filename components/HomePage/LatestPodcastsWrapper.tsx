import { getTrendingPodcasts } from '@/lib/actions/podcast.actions';
import { IPodcast } from '@/lib/models/Podcast';
import React from 'react';
import LatestPodcasts from './LatestPodcasts';

const LatestPodcastsWrapper = async () => {
  const data = await getTrendingPodcasts(4);
  const latestPodcasts: IPodcast[] = JSON.parse(JSON.stringify(data));
  return <LatestPodcasts latestPodcastsData={latestPodcasts} />;
};

export default LatestPodcastsWrapper;
