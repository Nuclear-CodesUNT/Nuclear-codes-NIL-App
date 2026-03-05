import mongoose from 'mongoose';

const inviteCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  role: { type: String, default: "athlete"},
  assignedTo: { type: String, default: "" },
  usesLeft: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'invitecodes' // <-- explicitly set collection name
});

const InviteCode = mongoose.model('InviteCode', inviteCodeSchema);

export default InviteCode;