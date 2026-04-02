import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // links to athlete
    lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer', required: true }, // links to lawyer
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number },
    status: {
        type: String,
        enum: ['Pending', 'Reviewing', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Contract', ContractSchema);