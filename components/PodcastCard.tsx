"use client";
import { incrementPodcastViews } from "@/lib/actions/podcast.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface PodcastCardProps {
  imgUrl: string;
  title: string;
  description: string;
  podcastId: string;
}
const PodcastCard = ({
  imgUrl,
  title,
  description,
  podcastId,
}: PodcastCardProps) => {
  const router = useRouter();

  const handleViews = async () => {
    await incrementPodcastViews(podcastId);

    router.push(`/podcasts/${podcastId}`, {
      scroll: true,
    });
  };

  return (
    <div className="cursor-pointer" onClick={handleViews}>
      <figure className="flex flex-col gap-2">
        <Image
          src={imgUrl}
          width={174}
          height={174}
          alt={title}
          className="aspect-square h-fit w-full rounded-xl 2xl:size-[200px] object-cover object-center"
        />
        <div className="flex flex-col 2xl:max-w-[200px]">
          <h1 className="text-16 truncate font-bold text-white-1">{title}</h1>
          <h2 className="text-12 truncate font-normal capitalize text-white-4">
            {description}
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default PodcastCard;
