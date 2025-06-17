"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";
import { Progress } from "./ui/progress";
import { formatTime } from "@/lib/formatTime";
import { useRouter } from "next/navigation";
import { Slider } from "./ui/slider";

const PodcastPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isVisible, setIsVisible] = useState(false);
  const { audio } = useAudio();
  const router = useRouter();

  // Initialize from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem("podcastVolume");
    if (savedVolume) {
      const volumeValue = parseFloat(savedVolume);
      if (!isNaN(volumeValue)) {
        setVolume(volumeValue);
      }
    }
    // Show player with animation
    setIsVisible(true);
  }, []);

  // Save playback position when audio changes or component unmounts
  useEffect(() => {
    const audioElement = audioRef.current;
    const savePosition = () => {
      if (audioElement && audio?.audioUrl) {
        localStorage.setItem(
          `podcastPosition_${audio.audioUrl}`,
          audioElement.currentTime.toString()
        );
      }
    };

    window.addEventListener("beforeunload", savePosition);
    return () => {
      savePosition();
      window.removeEventListener("beforeunload", savePosition);
    };
  }, [audio?.audioUrl]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play().then(() => setIsPlaying(true));
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    localStorage.setItem("podcastVolume", newVolume.toString());
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Check if currently muted
  const isMuted = volume === 0;

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
      let isMounted = true;

      const handleLoaded = async () => {
        // Load saved position if available
        const savedPosition = localStorage.getItem(
          `podcastPosition_${audio.audioUrl}`
        );
        const startTime = savedPosition ? parseFloat(savedPosition) : 0;

        // Wait for metadata to load
        await new Promise((resolve) => {
          const handleMetadata = () => {
            if (!isMounted) return;
            setDuration(audioElement.duration || 1);
            audioElement.removeEventListener("loadedmetadata", handleMetadata);
            resolve(null);
          };
          audioElement.addEventListener("loadedmetadata", handleMetadata);
        });

        // Set initial time
        audioElement.currentTime = startTime;
        setCurrentTime(startTime);

        // Try to play, but handle potential autoplay restrictions
        try {
          await audioElement.play();
          if (isMounted) setIsPlaying(true);
        } catch (err) {
          // Autoplay was prevented - wait for user interaction
          if (isMounted) setIsPlaying(false);
          console.log("Playback requires user interaction", err);
        }
      };

      audioElement.src = audio.audioUrl;
      audioElement.load();
      handleLoaded().catch(console.error);

      return () => {
        isMounted = false;
        audioElement.pause();
        setIsPlaying(false);
      };
    }
  }, [audio?.audioUrl]);

  // Time display component
  const timeDisplay = (
    <div className="flex items-center gap-2 text-12 md:text-16 font-normal text-white-2 w-[80px] md:w-[120px] text-right">
      <span className="tabular-nums">{formatTime(currentTime)}</span>
      <span>/</span>
      <span className="tabular-nums">{formatTime(duration)}</span>
    </div>
  );

  // Volume control component
  const volumeControl = (
    <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 justify-end items-end lg:items-center">
      {timeDisplay}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleVolumeChange([isMuted ? 0.7 : 0])}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="rounded-full p-1 transition hover:bg-white/10"
        >
          <Image
            src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
            width={22}
            height={22}
            alt={isMuted ? "Unmute" : "Mute"}
            className="max-md:size-4"
          />
        </button>
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.01}
          className="w-24 cursor-pointer "
        />
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 flex size-full flex-col bg-black/80 backdrop-blur-lg transition-all duration-500 ease-in-out",
        {
          hidden: !audio?.audioUrl || audio?.audioUrl === "" || !isVisible,
          "translate-y-0": isVisible && audio?.audioUrl && audio?.audioUrl,
        }
      )}
    >
      {/* Progress Bar */}
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
          max={100}
        />
      </div>

      <section className="glassmorphism-black flex h-[90px] md:h-[112px] w-full items-center justify-between px-4 md:px-12">
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onEnded={() => setIsPlaying(false)}
        />

        {/* Podcast Info */}
        <div
          onClick={() => router.push(`/podcasts/${audio?.podcastId}`)}
          className="flex w-1/4 items-center gap-4 cursor-pointer"
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
        </div>

        {/* Controls */}
        <div className="flex-center gap-2 md:gap-6 w-1/2 justify-center">
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
        <div className="flex w-1/4 items-center justify-end gap-4 md:gap-6 max-sm:gap-2">
          {volumeControl}
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;
