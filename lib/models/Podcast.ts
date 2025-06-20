import mongoose, { Schema } from 'mongoose';
import { Types } from 'mongoose';
import { IUser } from './User';

export interface IPodcast {
  _id: Types.ObjectId;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  audioUrl: string;
  authorClerkId: string;
  views: number;
  duration: number;
  userId: Types.ObjectId | IUser;
  voiceId: string;
  createdAt: Date;
}

const PodcastSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  audioUrl: { type: String, required: true },
  authorClerkId: { type: String, required: true },
  views: { type: Number, default: 0 },
  duration: { type: Number, require: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  voiceId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Podcast =
  mongoose.models.Podcast || mongoose.model('Podcast', PodcastSchema);
export default Podcast;
