'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';
import { VoiceActorSelectorProps } from '@/types';
import PreviewAudioPlayer from './PreviewAudioPlayer';

const VoiceActorSelector = ({
  voices,
  selectedVoiceId,
  setSelectedVoiceId,
}: VoiceActorSelectorProps) => {
  const [stability, setStability] = useState<number>(0.5);
  const [similarity, setSimilarity] = useState<number>(0.5);

  const selectedVoice =
    voices.find((voice) => voice.voice_id === selectedVoiceId) || voices[0];
  return (
    <div className="rounded-xl shadow-sm">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column - Voice Selection */}
        <div className="md:col-span-1">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="voice-select"
                className="text-16 mb-3 block font-bold text-white-1"
              >
                Select Voice Actor
              </Label>
              <Select
                value={selectedVoiceId}
                onValueChange={setSelectedVoiceId}
              >
                <SelectTrigger
                  id="voice-select"
                  className="text-16 w-full border-none bg-black-1 text-white-1 focus-visible:ring-offset-orange-1"
                >
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                  <SelectGroup>
                    <SelectLabel>Arabic Voices</SelectLabel>
                    {voices
                      .filter((voice) => voice.labels.language?.includes('ar'))
                      .map((voice) => (
                        <SelectItem key={voice.voice_id} value={voice.voice_id}>
                          {voice.name}
                        </SelectItem>
                      ))}

                    <SelectLabel>Other Languages</SelectLabel>
                    {voices
                      .filter((voice) => !voice.labels.language?.includes('ar'))
                      .map((voice) => (
                        <SelectItem key={voice.voice_id} value={voice.voice_id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Card className="card-class border border-gray-200">
              <CardHeader className="border-b border-gray-200 p-4">
                <CardTitle className="text-lg font-semibold">
                  Voice Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-sm font-medium">Stability</Label>
                    <span className="text-sm text-gray-500">
                      {stability.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    value={[stability]}
                    max={1}
                    step={0.1}
                    onValueChange={([value]) => setStability(value)}
                    className="[&>span:first-child]:h-2"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-sm font-medium">Similarity</Label>
                    <span className="text-sm text-gray-500">
                      {similarity.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    value={[similarity]}
                    max={1}
                    step={0.1}
                    onValueChange={([value]) => setSimilarity(value)}
                    className="[&>span:first-child]:h-2"
                  />
                </div>

                <div className="flex justify-center">
                  <div className="duration-400 flex w-full cursor-pointer items-center justify-center rounded-lg bg-white-1/85 py-3 text-black-1 transition-all hover:bg-white-1">
                    Apply Settings
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Voice Details */}
        <div className="md:col-span-2">
          <Card className="card-class h-full">
            <CardHeader className="border-b border-gray-200 p-4">
              <CardTitle className="text-lg font-semibold">
                {selectedVoice.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="space-y-4 md:w-2/3">
                  <div>
                    <Label className="mb-1 block text-sm font-medium">
                      Description
                    </Label>
                    <p className="text-gray-400">
                      {selectedVoice.description || 'No description available'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1 block text-sm font-medium">
                        Gender
                      </Label>
                      <div className="text-gray-400">
                        {selectedVoice.labels.gender || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-1 block text-sm font-medium">
                        Age
                      </Label>
                      <div className="text-gray-400">
                        {selectedVoice.labels.age || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-1 block text-sm font-medium">
                        Accent
                      </Label>
                      <div className="text-gray-400">
                        {selectedVoice.labels.accent || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-1 block text-sm font-medium">
                        Use Case
                      </Label>
                      <div className="text-gray-400">
                        {selectedVoice.labels.use_case || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Label className="mb-2 block text-sm font-medium">
                      Preview
                    </Label>
                    <PreviewAudioPlayer src={selectedVoice.preview_url!} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-16 mb-3 font-semibold text-white-1">
          Other Voice Actors
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {voices
            .filter((voice) => voice.voice_id !== selectedVoiceId)
            .slice(0, 3)
            .map((voice) => (
              <Card
                key={voice.voice_id}
                className="card-class cursor-pointer transition-colors"
                onClick={() => setSelectedVoiceId(voice.voice_id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src="/images/voice-actor.png"
                        height={48}
                        width={48}
                        alt="voice"
                        className="size-12"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{voice.name}</h4>
                      <p className="line-clamp-1 text-sm text-gray-300">
                        {voice.labels.accent}, {voice.labels.language}
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="rounded bg-gray-700 px-2 py-1 text-xs text-cyan-100">
                          {voice.labels.use_case}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceActorSelector;
