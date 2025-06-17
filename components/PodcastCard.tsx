'use client';
import { incrementPodcastViews } from '@/lib/actions/podcast.actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface PodcastCardProps {
  imgUrl: string;
  title: string;
  description: string;
  podcastId: string;
  insideFlexContainer?: boolean;
}
const PodcastCard = ({
  imgUrl,
  title,
  description,
  podcastId,
  insideFlexContainer = false,
}: PodcastCardProps) => {
  const router = useRouter();

  const handleViews = async () => {
    await incrementPodcastViews(podcastId);

    router.push(`/podcasts/${podcastId}`, {
      scroll: true,
    });
  };

  return (
    <div
      className={`cursor-pointer ${
        insideFlexContainer &&
        'w-[100px] md:w-[140px] lg:w-[160px] xl:w-[190px] 2xl:w-[200px]'
      }`}
      onClick={handleViews}
    >
      <figure className="flex w-full flex-col gap-2">
        <Image
          src={imgUrl}
          width={174}
          height={174}
          alt={title}
          className="aspect-square h-fit w-full rounded-xl object-cover object-center 2xl:size-[200px]"
        />
        <div className="flex flex-col 2xl:max-w-[200px]">
          <h1 className="lg:text-16 truncate text-[12px] font-bold text-white-1">
            {title}
          </h1>
          <h2 className="lg:text-12 truncate text-[10px] font-normal capitalize text-white-4">
            {description}
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default PodcastCard;
