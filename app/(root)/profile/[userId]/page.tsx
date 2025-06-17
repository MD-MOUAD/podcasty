import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import ProfileCard from "@/components/ProfileCard";
import { getAuthorPodcasts } from "@/lib/actions/podcast.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { notFound } from "next/navigation";

const ProfilePage = async ({
  params,
}: {
  params: {
    userId: string;
  };
}) => {
  const user = await getUserById({ userId: params.userId });
  const podcastsData = await getAuthorPodcasts(params.userId);

  if (!user || !podcastsData) notFound();

  if (!podcastsData) return <LoaderSpinner />;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={{
            podcasts: podcastsData.podcasts,
            listeners: podcastsData.views,
          }}
          imageUrl={user?.picture || "/images/default-user-profile.png"}
          userFirstName={user?.name}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData?.podcasts?.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                imgUrl={podcast.imageUrl}
                title={podcast.title}
                description={podcast.description}
                podcastId={podcast._id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
