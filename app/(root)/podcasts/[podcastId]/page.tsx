import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import { getPodcastById } from "@/lib/actions/podcast.actions";
import { delay } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

const PodcastDetails = async ({
  params,
}: {
  params: { podcastId: string };
}) => {
  const { userId } = await auth();

  let podcast;
  try {
    podcast = await getPodcastById(params.podcastId);
  } catch (error) {
    notFound();
  }
  if (!podcast) notFound();

  const isOwner = userId === podcast?.authorClerkId;

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">{podcast?.views}</h2>
        </figure>
      </header>

      <PodcastDetailPlayer
        isOwner={isOwner}
        podcast={JSON.parse(JSON.stringify(podcast))} //
      />

      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
        {podcast?.description}
      </p>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          {podcast?.content?.split("\n").map((line, idx) => (
            <p className="text-16 font-medium text-white-2" key={idx}>
              {line}
            </p>
          ))}
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>

        <EmptyState
          title="No similar podcasts found"
          buttonLink="/discover"
          buttonText="Discover more podcasts"
        />
        {/* {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts?.map(
              ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl as string}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              )
            )}
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          </>
        )} */}
      </section>
    </section>
  );
};

export default PodcastDetails;
