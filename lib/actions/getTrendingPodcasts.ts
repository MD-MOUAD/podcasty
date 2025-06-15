"use server";
import { connectToDatabase } from "@/lib/db";
import Podcast, { IPodcast } from "@/lib/models/Podcast";

export async function getTrendingPodcasts(): Promise<IPodcast[]> {
  try {
    await connectToDatabase();
    const podcasts = await Podcast.find().sort({ createdAt: -1 });
    return podcasts;
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
}
