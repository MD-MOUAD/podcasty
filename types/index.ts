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
