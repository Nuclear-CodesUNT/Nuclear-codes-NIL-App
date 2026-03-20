import mongoose, { Schema } from 'mongoose';

const MessagesSchema = new Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },
        message: { String, required: true },
        time: { type: Date, default: Date.now },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: "Receiver", required: true, index: true },
        account_type: {
            type: String, enum: ["athlete", "coach", "lawyer"],
            required: true
        }
    },
);

// One progress doc per (user, video)
MessagesSchema.index({ userId: 1, videoId: 1 }, { unique: true });

export default mongoose.model("Messages", MessagesSchema);