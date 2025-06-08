"use server";

import { connectToDatabase } from "../db";
import User from "../models/User";

export const test = async () => {
  await connectToDatabase();
  const clerkId = "user_2y96L5Gjk5lCBJI09g2psqqitxQ";

  await User.create({
    clerkId,
    firstName: "test",
    lastName: "test",
    email: "test",
    profileImageUrl: "test",
  });
};
