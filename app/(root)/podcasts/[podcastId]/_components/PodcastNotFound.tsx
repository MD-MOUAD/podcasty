import Image from 'next/image';
import Link from 'next/link';

const PodcastNotFound = () => {
  return (
    <div className="from-black text-white flex min-h-screen flex-col items-center justify-center bg-gradient-to-b to-gray-900 p-6">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/icons/logo.svg"
            alt="Podcasty"
            width={120}
            height={120}
          />
        </div>

        <h1 className="mb-4 text-6xl font-bold text-white-1">404</h1>
        <h2 className="mb-6 text-2xl font-semibold text-white-1">
          Podcast Not Found
        </h2>

        <p className="mb-8 text-gray-300">
          The podcast or page you&apos;re looking for doesn&apos;t exist or may
          have been removed.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-orange-1/80 px-6 py-3 font-medium text-white-1 transition-colors hover:bg-orange-1"
          >
            Return Home
          </Link>
          <Link
            href="/discover"
            className="rounded-full border border-white-1/30 bg-transparent px-6 py-3 font-medium text-white-1 transition-colors hover:bg-white-1/10"
          >
            Discover Podcasts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PodcastNotFound;
