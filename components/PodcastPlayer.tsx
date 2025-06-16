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
  const [duration, setDuration] = useState(0);
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
      audioElement.play().then(() => setIsPlaying(true));
    } else {
      audioElement?.pause();
      setIsPlaying(false);
    }
  }, [audio]);

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
          max={duration}
        />
        <div
          className="absolute left-0 top-0 h-full bg-primary-500"
          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
        />
      </div>

      <section className="glassmorphism-black flex h-[112px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration);
          }}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Podcast Info */}
        <div className="flex items-center gap-4 max-md:hidden">
          <Link href={`/podcast/${audio?.podcastId}`}>
            <Image
              src={audio?.imageUrl || "/images/default-podcast-thumbnail.png"}
              width={64}
              height={64}
              alt="Podcast cover"
              className="aspect-square rounded-xl object-cover"
              priority
            />
          </Link>
          <div className="flex min-w-0 flex-col">
            <h2 className="truncate text-14 font-semibold text-white-1">
              {audio?.title || "No podcast selected"}
            </h2>
            <p className="text-12 font-normal text-white-2">
              {audio?.author || "Unknown author"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-center cursor-pointer gap-3 md:gap-6">
          <button
            className="flex items-center gap-1.5"
            onClick={() => skip(-5)}
            aria-label="Rewind 5 seconds"
          >
            <Image
              src="/icons/reverse.svg"
              width={24}
              height={24}
              alt="Rewind"
            />
            <span className="text-12 font-bold text-white-4">-5</span>
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
            />
          </button>

          <button
            className="flex items-center gap-1.5"
            onClick={() => skip(5)}
            aria-label="Forward 5 seconds"
          >
            <span className="text-12 font-bold text-white-4">+5</span>
            <Image
              src="/icons/forward.svg"
              width={24}
              height={24}
              alt="Forward"
            />
          </button>
        </div>

        {/* Time and Volume */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-16 font-normal text-white-2">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="rounded-full p-1 transition hover:bg-white/10"
          >
            <Image
              src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
              width={24}
              height={24}
              alt={isMuted ? "Unmute" : "Mute"}
            />
          </button>
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;
