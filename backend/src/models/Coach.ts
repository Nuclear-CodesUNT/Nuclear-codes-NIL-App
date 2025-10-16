import { Schema, model, Document, Types } from 'mongoose';

export interface ICoach extends Document {
    userId: Types.ObjectId;
    school: string;
    sport: string;
}

const CoachSchema = new Schema<ICoach>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    school: { type: String, required: true },
    sport: { type: String, required: true },
}, {
  timestamps: true
});

export default model<ICoach>('Coach', CoachSchema);