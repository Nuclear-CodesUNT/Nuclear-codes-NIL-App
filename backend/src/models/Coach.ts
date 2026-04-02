import { Schema, model, Document, Types } from 'mongoose';

export interface ICoach extends Document {
  userId: Types.ObjectId;
  school: string;
  sport: string;
  role?: string; // e.g., Head Coach, Assistant Coach
  yearsOfExperience?: number;
  certifications?: string[];
  achievements?: string[];
  bio?: string;
  profilePicture?: string;
  specializations?: string[];
}

const CoachSchema = new Schema<ICoach>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  school: { type: String, required: true },
  sport: { type: String, required: true },
  role: { type: String },
  yearsOfExperience: { type: Number, min: 0 },
  certifications: [{ type: String }],
  achievements: [{ type: String }],
  bio: { type: String },
  profilePicture: { type: String },
  specializations: [{ type: String }],
}, {
  timestamps: true
});

export default model<ICoach>('Coach', CoachSchema);