'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IPodcast } from '@/lib/models/Podcast';
import PodcastCard from './PodcastCard';

const PodcastsSlider = ({ podcasts }: { podcasts: IPodcast[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const calculateScrollAmount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const remainingSpace = containerWidth % (200 + 16); // podcast width + gap
        setScrollAmount(containerWidth - remainingSpace + 16);
      }
    };

    const updateScrollButtons = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      calculateScrollAmount();
      updateScrollButtons();
    });

    const container = containerRef.current;
    if (container) {
      resizeObserver.observe(container);
      container.addEventListener('scroll', updateScrollButtons);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
        container.removeEventListener('scroll', updateScrollButtons);
      }
    };
  }, []);

  const scrollPodcasts = (direction: 1 | -1) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  return (
    <div className="relative">
      {/* Previous Button */}
      {canScrollLeft && (
        <Button
          onClick={() => scrollPodcasts(-1)}
          className="text-white absolute -left-0 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white-1/40 hover:bg-white-1/60 sm:flex"
        >
          <ChevronLeft />
        </Button>
      )}
      <div
        ref={containerRef}
        className="no-scrollbar flex gap-2 overflow-x-auto md:gap-8 lg:gap-10 xl:gap-12"
      >
        {podcasts?.map(({ _id, title, description, imageUrl }) => (
          <PodcastCard
            key={_id.toString()}
            imgUrl={imageUrl}
            title={title}
            description={description}
            podcastId={_id.toString()}
            insideFlexContainer
          />
        ))}
      </div>
      {/* Next Button */}
      {canScrollRight && (
        <Button
          onClick={() => scrollPodcasts(1)}
          className="text-white absolute right-0 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white-1/40 hover:bg-white-1/60 sm:flex"
        >
          <ChevronRight />
        </Button>
      )}
    </div>
  );
};

export default PodcastsSlider;
