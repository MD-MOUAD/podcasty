import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  picture?: string;
  podcasts: Types.ObjectId[];
  createdAt: Date;
}

// Mongoose schema
const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: String,
  podcasts: [{ type: Schema.Types.ObjectId, ref: 'Podcast' }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
