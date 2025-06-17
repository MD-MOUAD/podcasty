"use server";

import { uploadMedia, deleteMedia } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import Podcast, { IPodcast } from "@/lib/models/Podcast";
import User from "@/lib/models/User";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { AuthorPodcastsResponse } from "./shared.types";

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

export async function getAuthorPodcasts(
  clerkId: string
): Promise<AuthorPodcastsResponse | undefined> {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }

    // Find all podcasts by this user and populate the userId field
    const podcasts = await Podcast.find({ userId: user._id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate("userId", "name picture clerkId");

    // Calculate total views across all podcasts
    const totalViews = podcasts.reduce(
      (sum, podcast) => sum + (podcast.views || 0),
      0
    );

    return {
      podcasts: JSON.parse(JSON.stringify(podcasts)),
      views: totalViews,
    };
  } catch (error) {
    console.error("Error getting author podcasts:", error);
  }
}

export async function deletePodcast(podcastId: string, path: string) {
  try {
    await connectToDatabase();

    // Find the podcast to get file URLs and user reference
    const podcast = await Podcast.findById(podcastId);
    if (!podcast) {
      throw new Error("Podcast not found");
    }

    // Delete from Cloudinary - both image and audio
    const deletePromises = [];

    if (podcast.imageUrl) {
      deletePromises.push(deleteMedia(podcast.imageUrl, "image"));
    }

    if (podcast.audioUrl) {
      deletePromises.push(deleteMedia(podcast.audioUrl, "video"));
    }

    // Wait for all Cloudinary deletions to complete
    await Promise.all(deletePromises);

    // Delete from User's podcast array
    await User.findByIdAndUpdate(
      podcast.userId,
      { $pull: { podcasts: podcast._id } },
      { new: true }
    );

    // Delete the podcast itself
    await Podcast.findByIdAndDelete(podcastId);

    // Revalidate the path to update the UI
    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.error("Error deleting podcast:", error);
  }
}
