"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";
import { Progress } from "./ui/progress";
import { formatTime } from "@/lib/formatTime";

const PodcastPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(1); // Initialize with 1 to avoid 0 value
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const { audio } = useAudio();

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play().then(() => setIsPlaying(true));
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle progress bar seeking
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const seekTime = pos * duration;

    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Handle progress bar drag
  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSeeking || !progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const pos = Math.min(Math.max((e.clientX - rect.left) / rect.width, 1), 0);
    const seekTime = pos * duration;

    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Update time display
  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current && !isSeeking) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateTime);
      return () => audioElement.removeEventListener("timeupdate", updateTime);
    }
  }, [isSeeking]);

  // Handle audio source changes
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audio?.audioUrl && audioElement) {
      audioElement.load();
      const handleLoadedMetadata = () => {
        setDuration(audioElement.duration || 1); // Ensure duration is never 0
      };
      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.play().then(() => setIsPlaying(true));

      return () => {
        audioElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      };
    } else {
      audioElement?.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  // Fixed width for time display to prevent layout shift
  const timeDisplay = (
    <div className="flex items-center gap-2 text-12 md:text-16 font-normal text-white-2 w-[80px] md:w-[120px] text-right">
      <span className="tabular-nums">{formatTime(currentTime)}</span>
      <span>/</span>
      <span className="tabular-nums">{formatTime(duration)}</span>
    </div>
  );

  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 flex size-full flex-col bg-black/80 backdrop-blur-lg",
        {
          hidden: !audio?.audioUrl || audio?.audioUrl === "",
        }
      )}
    >
      {/* Progress Bar with seek control */}
      <div
        ref={progressRef}
        className="group relative w-full cursor-pointer"
        onClick={handleProgressClick}
        onMouseDown={() => setIsSeeking(true)}
        onMouseUp={() => setIsSeeking(false)}
        onMouseLeave={() => setIsSeeking(false)}
        onMouseMove={handleProgressDrag}
      >
        <Progress
          value={(currentTime / duration) * 100 || 0}
          className="h-1.5 w-full rounded-none transition-all group-hover:h-2"
          max={100} // Changed to fixed 100 to match percentage-based progress
        />
      </div>

      <section className="glassmorphism-black flex h-[90px] md:h-[112px] w-full items-center justify-between px-4 md:px-12 gap-4">
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onEnded={() => setIsPlaying(false)}
        />

        {/* Podcast Info - Hidden on mobile */}
        <Link
          href={`/podcasts/${audio?.podcastId}`}
          className="flex items-center gap-4"
        >
          <Image
            src={audio?.imageUrl || "/images/default-podcast-thumbnail.png"}
            width={64}
            height={64}
            alt="Podcast cover"
            className="aspect-square rounded-xl object-cover max-md:w-12 max-md:h-12"
            priority
          />

          <div className="flex min-w-0 flex-col max-md:hidden">
            <h2 className="truncate text-14 font-semibold text-white-1">
              {audio?.title || "No podcast selected"}
            </h2>
            <p className="text-12 font-normal text-white-2">
              {audio?.author || "Unknown author"}
            </p>
          </div>
        </Link>

        {/* Controls */}
        <div className="flex-center gap-2 md:gap-6 flex-1 justify-center">
          <button
            className="flex items-center gap-1.5"
            onClick={() => skip(-5)}
            aria-label="Rewind 5 seconds"
          >
            <Image
              src="/icons/reverse.svg"
              width={30}
              height={30}
              alt="Rewind"
              className="max-md:w-6 max-md:h-6"
            />
            <span className="text-12 font-bold text-white-4 max-md:hidden">
              -5
            </span>
          </button>

          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
          >
            <Image
              src={isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
              width={30}
              height={30}
              alt={isPlaying ? "Pause" : "Play"}
              className="max-md:size-6"
            />
          </button>

          <button
            className="flex items-center gap-1.5"
            onClick={() => skip(5)}
            aria-label="Forward 5 seconds"
          >
            <span className="text-12 font-bold text-white-4 max-md:hidden">
              +5
            </span>
            <Image
              src="/icons/forward.svg"
              width={30}
              height={30}
              alt="Forward"
              className="max-md:w-6 max-md:h-6"
            />
          </button>
        </div>

        {/* Time and Volume */}
        <div className="flex items-center gap-4 md:gap-6 max-sm:gap-2">
          {timeDisplay}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="rounded-full p-1 transition hover:bg-white/10"
          >
            <Image
              src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
              width={28}
              height={28}
              alt={isMuted ? "Unmute" : "Mute"}
              className="max-md:size-5"
            />
          </button>
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;
