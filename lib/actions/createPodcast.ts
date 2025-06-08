"use server";

import { uploadMedia } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import Podcast from "@/lib/models/Podcast";
import User from "@/lib/models/User";
import { generateAudio } from "./generateAudio";
import { auth } from "@clerk/nextjs/server";

export const createPodcast = async (
  prevState: { success: boolean; podcastId?: string; error?: string },
  formData: FormData
) => {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");
  console.log(clerkId);

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    // Connect to database
    await connectToDatabase();

    // Get user from database
    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");

    // Generate media in parallel
    const audioArrayBuffer = await generateAudio(content);

    // Convert audio ArrayBuffer to Buffer
    const audioBuffer = Buffer.from(audioArrayBuffer);

    // Upload media to Cloudinary
    const uploadedAudioUrl = await uploadMedia(audioBuffer, "podcast-audio");

    // Create new podcast
    const podcast = new Podcast({
      title,
      content,
      imageUrl: "not included",
      audioUrl: uploadedAudioUrl,
      userId: user._id,
    });

    // Save podcast
    await podcast.save();

    // Add podcast to user's podcasts array
    user.podcasts.push(podcast._id);
    await user.save();

    return { success: true, podcastId: podcast._id.toString() };
  } catch (error) {
    console.error("Podcast creation failed:", error);
    return { success: false, error: "Failed to create podcast" };
  }
};
