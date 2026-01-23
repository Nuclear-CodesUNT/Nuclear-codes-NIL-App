import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const VideosSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },

    durationSeconds: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVideo>("Videos", VideosSchema);
