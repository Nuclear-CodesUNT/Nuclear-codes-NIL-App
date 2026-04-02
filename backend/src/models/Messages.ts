import mongoose, { Schema } from 'mongoose';

const MessagesSchema = new Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },
        message: { type: String, required: true },
        time: { type: Date, default: Date.now },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        account_type: {
            type: String, enum: ["athlete", "coach", "lawyer"],
            required: true
        }
    },
);

MessagesSchema.index({ conversationId: 1, time: -1 });

export default mongoose.model("Messages", MessagesSchema);