import { Schema, model, Document, Types } from 'mongoose';

export interface IAthlete extends Document {
  userId: Types.ObjectId;
  school: string;
  currentYear: string;
  sport?: string;
  position?: string;
}

const AthleteSchema = new Schema<IAthlete>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  school: { type: String, required: true },
  currentYear: { type: String, required: true },
  sport: { type: String, required: false },
  position: { type: String, required: false},
}, {
  timestamps: true
});

export default model<IAthlete>('Athlete', AthleteSchema);