import { TopPodcaster } from "@/lib/actions/shared.types";
import { getTopPodcasters } from "@/lib/actions/user.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TopPodcasersSceleton = () => {
  return (
    <div className="flex flex-col gap-6 max-h-[400px] w-full min-w-0 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex cursor-pointer justify-between items-center"
        >
          <div className="flex items-center gap-2">
            <div className="aspect-square w-11 rounded-lg bg-gray-400 animate-pulse" />
            <div className="h-2.5 w-28 rounded-lg bg-gray-400 animate-pulse" />
          </div>
          <div className="h-2.5 w-14 rounded-lg bg-gray-400 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

const TopPodcasters = () => {
  const [topPodcasters, setTopPodcasters] = useState<TopPodcaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getTopPodcasters(5);
        setTopPodcasters(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <TopPodcasersSceleton />;
  }
  return (
    <div className="flex flex-col gap-6 h-[400px] w-full min-w-0">
      {topPodcasters?.slice(0, 3).map((podcaster) => (
        <div
          key={podcaster.clerkId as string}
          className="flex cursor-pointer justify-between"
          onClick={() => router.push(`/profile/${podcaster.clerkId}`)}
        >
          <figure className="flex items-center gap-2">
            <Image
              src={podcaster.picture as string}
              alt={podcaster.name}
              priority
              width={44}
              height={44}
              className="aspect-square rounded-lg object-cover object-center"
            />
            <h2 className="text-[12px] font-semibold text-white-1">
              {podcaster.name}
            </h2>
          </figure>
          <div className="flex items-center">
            <p className="text-12 font-normal text-white-1">
              {podcaster.podcastCount} podcasts
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopPodcasters;
