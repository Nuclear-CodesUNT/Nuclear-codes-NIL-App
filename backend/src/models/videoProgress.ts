import mongoose, { Schema } from "mongoose";

const VideoProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    videoId: { type: Schema.Types.ObjectId, ref: "Videos", required: true, index: true },

    secondsWatched: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One progress doc per (user, video)
VideoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

export default mongoose.model("VideoProgress", VideoProgressSchema);
