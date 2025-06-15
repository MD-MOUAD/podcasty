import mongoose, { Schema } from "mongoose";
import { Types } from "mongoose";

export interface IPodcast {
  _id: Types.ObjectId;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  audioUrl: string;
  userId: Types.ObjectId;
  createdAt: Date;
}

const PodcastSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  audioUrl: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Podcast =
  mongoose.models.Podcast || mongoose.model("Podcast", PodcastSchema);
export default Podcast;
