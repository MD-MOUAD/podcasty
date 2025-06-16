import { TopPodcaster } from "@/lib/actions/shared.types";
import { IPodcast } from "@/lib/models/Podcast";
import { Dispatch, SetStateAction } from "react";

export interface VoiceActor {
  voice_id: string;
  name: string;
  labels: {
    accent?: string;
    gender?: string;
    age?: string;
    language?: string;
    use_case?: string;
  };
  description?: string;
  preview_url?: string;
}

export interface VoiceActorSelectorProps {
  voices: VoiceActor[];
  selectedVoiceId: string;
  setSelectedVoiceId: Dispatch<SetStateAction<string>>;
}
export interface GeneratePodcastPreviewProps {
  voiceId: string;
  setPodcastContent: Dispatch<SetStateAction<string>>;
  previewUrl: string;
  setPreviewUrl: Dispatch<SetStateAction<string>>;
  setAudioBlob: Dispatch<SetStateAction<Blob | null>>;
}

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<Blob | null>>;
}

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface PodcastDetailPlayerProps {
  podcast: IPodcast;
  isOwner: boolean;
}

export interface CarouselProps {
  fansLikeDetail: TopPodcaster[];
}

export interface AudioProps {
  title: string;
  audioUrl: string;
  authorClerkId: string;
  author: string;
  imageUrl: string;
  podcastId: string;
}

export interface AudioContextType {
  audio: AudioProps | undefined;
  setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
}
