'use client';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Loader } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import PreviewAudioPlayer from './PreviewAudioPlayer';
import { GeneratePodcastPreviewProps } from '@/types';
import { useToast } from '@/hooks/use-toast';

const GeneratePodcastPreview = ({
  voiceId,
  setPodcastContent,
  previewUrl,
  setPreviewUrl,
  setAudioBlob,
  setDuration,
}: GeneratePodcastPreviewProps) => {
  const [voicePrompt, setVoicePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const previousPrompt = useRef('');
  const { toast } = useToast();

  const MAX_CHARACTERS = 1000;

  useEffect(() => {
    const valid =
      voicePrompt.trim().length > 0 &&
      voicePrompt.trim().length <= MAX_CHARACTERS &&
      (voicePrompt !== previousPrompt.current || !hasGenerated);
    setIsValid(valid);
    setCharacterCount(voicePrompt.length);
  }, [voicePrompt, hasGenerated]);

  const generatePreview = async () => {
    if (!isValid) {
      toast({
        title: 'Invalid Input',
        description:
          voicePrompt.trim().length === 0
            ? 'Please enter some text to generate audio'
            : `Text must be ${MAX_CHARACTERS} characters or less`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsGenerating(true);
      previousPrompt.current = voicePrompt;

      // Clear previous audio if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
        setAudioBlob(null);
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        body: JSON.stringify({
          text: voicePrompt,
          voiceId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `API request failed with status ${response.status}`
        );
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error('Received empty audio file');
      }

      const blobUrl = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setPreviewUrl(blobUrl);
      setHasGenerated(true); // Mark as generated

      setPodcastContent(voicePrompt);

      toast({
        title: 'Success!',
        description: 'Audio preview generated successfully',
      });

      // Clear the text area after successful generation
      setVoicePrompt('');
    } catch (error) {
      console.error('Audio generation error:', error);

      let errorMessage = 'Failed to generate audio preview';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Generation Error',
        description: errorMessage,
        variant: 'destructive',
      });

      // Reset preview state on error
      setPreviewUrl('');
      setAudioBlob(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-16 font-bold text-white-1">
            AI Prompt to generate Podcast
          </Label>
          <span
            className={`text-sm ${
              characterCount > MAX_CHARACTERS ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {characterCount}/{MAX_CHARACTERS}
          </span>
        </div>
        <Textarea
          className="input-class max-sm:placeholder:text-12 font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate audio"
          rows={5}
          value={voicePrompt}
          onChange={(e) => {
            setVoicePrompt(e.target.value);
            setHasGenerated(false); // Reset generated state when typing
          }}
          disabled={isGenerating}
        />
        {characterCount > MAX_CHARACTERS && (
          <p className="text-sm text-red-500">
            Prompt must be {MAX_CHARACTERS} characters or less
          </p>
        )}
      </div>

      <div className="mt-5 w-full max-w-[250px]">
        <button
          className={`text-12 sm:text-16 flex items-center justify-center gap-1 rounded-lg px-5 py-3 font-bold text-white-1 sm:px-10 ${
            isValid && !hasGenerated
              ? 'bg-orange-1 hover:bg-orange-600'
              : 'cursor-not-allowed bg-gray-500/50'
          }`}
          onClick={generatePreview}
          disabled={!isValid || isGenerating || hasGenerated}
          aria-label={
            isValid && !hasGenerated
              ? 'Generate audio preview'
              : hasGenerated
                ? 'Audio already generated'
                : 'Enter valid text to enable generation'
          }
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="ml-2 animate-spin" />
            </>
          ) : (
            'Generate Podcast ✨'
          )}
        </button>
      </div>

      <div className="mt-5 max-w-[600px]">
        {previewUrl && (
          <PreviewAudioPlayer src={previewUrl} onDurationChange={setDuration} />
        )}
      </div>
    </div>
  );
};

export default GeneratePodcastPreview;
