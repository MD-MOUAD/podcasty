import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselProps } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TopPodcaster } from "@/lib/actions/shared.types";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";

const Carousel = ({ fansLikeDetail }: CarouselProps) => {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  // Simplified dot button interaction
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const slides = fansLikeDetail?.filter(
    (item: TopPodcaster) => item.podcastCount > 0,
  );

  return (
    <section
      className="flex w-full flex-col gap-4 overflow-hidden min-h-[276px]"
      ref={emblaRef}
    >
      <div className="flex w-full">
        {slides.slice(0, 5).map((item) => (
          <figure
            key={item.clerkId}
            className="carousel_box flex-[0_0_100%] min-w-0" // Important for slide sizing
            onClick={() => router.push(`/podcasts/${item.latestPodcast?._id}`)}
          >
            <Image
              src={item.picture as string}
              alt="card"
              fill
              priority
              className="absolute size-full rounded-xl border-none object-cover"
            />
            <div className="glassmorphism-black relative z-10 flex flex-col rounded-b-xl p-4">
              <h2 className="text-14 font-semibold text-white-1">
                {item.latestPodcast?.title}
              </h2>
              <p className="text-12 font-normal text-white-2">{item.name}</p>
            </div>
          </figure>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
