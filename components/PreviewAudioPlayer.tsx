"use client";

import { useRef, useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  className?: string;
  onDurationChange?: (duration: number) => void;
}

export default function PreviewAudioPlayer({
  src,
  className,
  onDurationChange,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Handle duration reporting
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !onDurationChange) return;

    const handleLoadedMetadata = () => {
      onDurationChange(Math.floor(audio.duration));
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [src, onDurationChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioData = () => {
      setDuration(audio.duration);
      setIsReady(true);
    };
    const handleEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("canplay", setAudioData);
    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("canplay", setAudioData);
      audio.removeEventListener("ended", handleEnd);
    };
  }, [src]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = value[0];
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      className={`bg-black-5 p-4 rounded-xl flex flex-col gap-4 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-4">
        <div
          onClick={togglePlayback}
          className="h-10 w-10 shrink-0 flex items-center justify-center hover:cursor-pointer hover:bg-black-1/60 rounded-lg bg-black-3/20 transition-all duration-400"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" color="white" />
          ) : (
            <Play className="h-4 w-4" color="white" />
          )}
        </div>

        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm text-gray-300 w-12 tabular-nums">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 1}
            step={0.1}
            onValueChange={handleSeek}
            className="flex-1"
            disabled={!isReady}
          />
          <span className="text-sm text-gray-300 w-12 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-14">
        <div
          className="h-8 w-8 flex items-center justify-center hover:cursor-pointer hover:bg-black-1/10 rounded-md"
          onClick={toggleMute}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-4 w-4" color="white" />
          ) : (
            <Volume2 className="h-4 w-4" color="white" />
          )}
        </div>
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
      </div>

      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
    </div>
  );
}
