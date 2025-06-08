import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  profileImageUrl: String,
  podcasts: [{ type: Schema.Types.ObjectId, ref: "Podcast" }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
