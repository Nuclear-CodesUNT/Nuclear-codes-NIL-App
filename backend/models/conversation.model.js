import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // links to user model
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message', // links to message model
        default: []
    }]
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;