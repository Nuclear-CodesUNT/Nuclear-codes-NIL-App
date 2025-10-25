import { Schema, model, Document, Types } from 'mongoose';

export interface ILawyer extends Document {
  userId: Types.ObjectId;
  barNumber: string;
  state: string;
  firmName?: string;
  specializations: string[];
  yearsOfExperience: number;
}

const LawyerSchema = new Schema<ILawyer>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  barNumber: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  firmName: { type: String },
  specializations: [{ type: String }],
  yearsOfExperience: { type: Number, required: true, min: 0 }
}, {
  timestamps: true
});

export default model<ILawyer>('Lawyer', LawyerSchema);