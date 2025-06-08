import mongoose, { Schema } from "mongoose";

const PodcastSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  audioUrl: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  createdAt: { type: Date, default: Date.now },
});

const Podcast =
  mongoose.models.Podcast || mongoose.model("Podcast", PodcastSchema);
export default Podcast;
