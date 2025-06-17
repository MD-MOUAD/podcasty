"use server";

import { uploadMedia } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import Podcast, { IPodcast } from "@/lib/models/Podcast";
import User from "@/lib/models/User";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

export const createPodcast = async (
  title: string,
  description: string,
  content: string,
  audioBase64: string,
  imageBase64: string,
  voiceId: string,
  duration: number,
  path: string
): Promise<{ success: boolean; podcastId?: string; error?: string }> => {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    if (!title || !description || !content || !audioBase64 || !imageBase64) {
      return { success: false, error: "Missing required fields" };
    }

    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Convert Base64 to Buffer
    const audioBuffer = Buffer.from(audioBase64.split(",")[1], "base64");
    const imageBuffer = Buffer.from(imageBase64.split(",")[1], "base64");

    const uploadedAudioUrl = await uploadMedia(audioBuffer, "podcast-audio");
    const uploadedImageUrl = await uploadMedia(imageBuffer, "podcast-images");

    if (!uploadedAudioUrl) {
      return { success: false, error: "Failed to upload audio" };
    }

    const podcast = new Podcast({
      title,
      description,
      content,
      imageUrl: uploadedImageUrl,
      audioUrl: uploadedAudioUrl,
      userId: user._id,
      authorClerkId: user.clerkId,
      voiceId,
      duration,
    });

    await podcast.save();
    user.podcasts.push(podcast._id);
    await user.save();

    revalidatePath(path);

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

export const getTrendingPodcasts = async (
  limit: number = 12
): Promise<IPodcast[]> => {
  try {
    await connectToDatabase();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const trendingPodcasts = await Podcast.find({
      createdAt: { $gte: oneWeekAgo },
    })
      .sort({ views: -1 })
      .limit(limit);

    return trendingPodcasts;
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
};

export const getPodcastById = async (
  podcastId: string
): Promise<IPodcast | null> => {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(podcastId)) {
      throw new Error("Invalid podcast ID");
    }
    const podcast = await Podcast.findById(podcastId).populate("userId");

    return podcast;
  } catch (error) {
    console.error("Error fetching podcast by ID:", error);
    return null;
  }
};

export async function incrementPodcastViews(podcastId: string) {
  await connectToDatabase();
  await Podcast.findByIdAndUpdate(
    podcastId,
    { $inc: { views: 1 } },
    { new: true }
  );
}
