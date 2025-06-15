"use server";

import { uploadMedia } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import Podcast from "@/lib/models/Podcast";
import User from "@/lib/models/User";
import { auth } from "@clerk/nextjs/server";

export const createPodcast = async (
  title: string,
  description: string,
  content: string,
  audioBase64: string
): Promise<{ success: boolean; podcastId?: string; error?: string }> => {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    if (!title || !description || !content || !audioBase64) {
      return { success: false, error: "Missing required fields" };
    }

    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Convert Base64 to Buffer
    const buffer = Buffer.from(audioBase64.split(",")[1], "base64");

    const uploadedAudioUrl = await uploadMedia(buffer, "podcast-audio");

    if (!uploadedAudioUrl) {
      return { success: false, error: "Failed to upload audio" };
    }

    const podcast = new Podcast({
      title,
      description,
      content,
      imageUrl: "default-podcast-image.jpg",
      audioUrl: uploadedAudioUrl,
      userId: user._id,
    });

    await podcast.save();
    user.podcasts.push(podcast._id);
    await user.save();

    return { success: true, podcastId: podcast._id.toString() };
  } catch (error) {
    console.error("Podcast creation failed:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create podcast",
    };
  }
};
