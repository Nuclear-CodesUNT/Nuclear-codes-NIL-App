import mongoose, { Schema } from "mongoose";

const VideoBookmarkSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    videoId: { type: Schema.Types.ObjectId, ref: "Videos", required: true, index: true },
  },
  { timestamps: true }
);

// One bookmark per (user, video)
VideoBookmarkSchema.index({ userId: 1, videoId: 1 }, { unique: true });

export default mongoose.model("VideoBookmark", VideoBookmarkSchema);
