import { IUser } from "@/lib/models/User";

export interface CreateUserParams {
  clerkId: string;
  name: string;
  email: string;
  picture: string;
}

export interface GetUserByIdParams {
  userId: string;
}

export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

export interface DeleteUserParams {
  clerkId: string;
}

interface TopPodcaster {
  clerkId: string;
  name: string;
  picture?: string;
  podcastCount: number;
  latestPodcast?: {
    _id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
  };
}
