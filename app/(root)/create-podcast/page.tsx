"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader } from "lucide-react";
import GeneratePodcastPreview from "@/components/GeneratePodcastPreview";
import VoiceActorSelector from "@/components/VoiceActorSelector";
import voiceData from "@/data/voices.json";
import { createPodcast } from "@/lib/actions/podcast.actions";
import { useToast } from "@/hooks/use-toast";
import GeneratePodcastThumbnail from "@/components/GeneratePodcastThumbnail";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  podcastTitle: z
    .string()
    .min(3, "Podcast title must be at least 3 characters.")
    .max(100, "Podcast title must be at most 100 characters."),

  podcastDescription: z
    .string()
    .min(10, "Description should be at least 10 characters.")
    .max(1000, "Description can't exceed 1000 characters."),
});

const CreatePodcast = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(
    voiceData[0]?.voice_id || ""
  );
  const [podcastContent, setPodcastContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
    });
  };

  const resetForm = () => {
    form.reset();
    setPreviewUrl("");
    setAudioBlob(null);
    setImageBlob(null);
    setPodcastContent("");
  };

  const validateRequiredFields = () => {
    if (!audioBlob) {
      toast({
        title: "Error",
        description: "Please generate an audio preview first",
        variant: "destructive",
      });
      return false;
    }

    if (!imageBlob) {
      toast({
        title: "Error",
        description: "Please provide a thumbnail for the podcast",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!validateRequiredFields()) return;

    try {
      setIsSubmitting(true);

      const [audioBase64, imageBase64] = await Promise.all([
        convertBlobToBase64(audioBlob!),
        convertBlobToBase64(imageBlob!),
      ]);

      const result = await createPodcast(
        data.podcastTitle,
        data.podcastDescription,
        podcastContent,
        audioBase64,
        imageBase64,
        selectedVoiceId,
        duration,
        "/"
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Podcast created successfully!",
        });
        resetForm();
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create podcast",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col"
        >
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="e.g. The Creative Hour"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-orange-1" />
                </FormItem>
              )}
            />
            <VoiceActorSelector
              voices={voiceData}
              selectedVoiceId={selectedVoiceId}
              setSelectedVoiceId={setSelectedVoiceId}
            />

            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Write a short podcast description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-orange-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <GeneratePodcastPreview
              voiceId={selectedVoiceId}
              setPodcastContent={setPodcastContent}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              setAudioBlob={setAudioBlob}
              setDuration={setDuration}
            />
            <GeneratePodcastThumbnail setImage={setImageBlob} />

            <div className="mt-10 w-11/12 mx-auto">
              <Button
                type="submit"
                className="text-16 w-full bg-orange-1 py-6 font-extrabold text-white-1 transition-all duration-500"
              >
                {isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="ml-2 animate-spin" />
                  </>
                ) : (
                  "Submit & Publish Podcast"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcast;
