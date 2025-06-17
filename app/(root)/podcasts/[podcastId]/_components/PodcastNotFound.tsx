import Image from "next/image";
import Link from "next/link";

const PodcastNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/icons/logo.svg"
            alt="Podcasty"
            width={120}
            height={120}
          />
        </div>

        <h1 className="text-6xl font-bold mb-4 text-white-1">404</h1>
        <h2 className="text-2xl font-semibold mb-6 text-white-1">
          Podcast Not Found
        </h2>

        <p className="text-gray-300 mb-8">
          The podcast or page you&apos;re looking for doesn&apos;t exist or may
          have been removed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-orange-1/80 hover:bg-orange-1 text-white-1 font-medium py-3 px-6 rounded-full transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/discover"
            className="bg-transparent hover:bg-white-1/10 text-white-1 font-medium py-3 px-6 rounded-full border border-white-1/30 transition-colors"
          >
            Discover Podcasts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PodcastNotFound;
