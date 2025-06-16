"use server";

import { revalidatePath } from "next/cache";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/db";
import {
  CreateUserParams,
  DeleteUserParams,
  GetUserByIdParams,
  TopPodcaster,
  UpdateUserParams,
} from "@/lib/actions/shared.types";

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User Not Found");
    }
    // Todo: delete all related podcasts
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopPodcasters(limit: number): Promise<TopPodcaster[]> {
  try {
    await connectToDatabase();

    const result = await User.aggregate([
      {
        $lookup: {
          from: "podcasts",
          localField: "_id",
          foreignField: "userId",
          as: "podcasts",
        },
      },
      {
        $addFields: {
          podcastCount: { $size: "$podcasts" },
        },
      },
      { $match: { podcastCount: { $gt: 0 } } },
      { $sort: { podcastCount: -1, name: 1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          clerkId: 1,
          name: 1,
          picture: 1,
          podcastCount: 1,
          latestPodcast: {
            $let: {
              vars: { firstPod: { $arrayElemAt: ["$podcasts", -1] } },
              in: {
                _id: { $toString: "$$firstPod._id" },
                title: "$$firstPod.title",
                imageUrl: "$$firstPod.imageUrl",
                createdAt: { $toString: "$$firstPod.createdAt" },
              },
            },
          },
        },
      },
    ]).exec(); // .exec() returns a proper Promise

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("[GET_TOP_PODCASTERS]", error);
    throw new Error("Failed to fetch top podcasters");
  }
}
