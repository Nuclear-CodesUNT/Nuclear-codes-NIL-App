import { Schema, model, Document } from 'mongoose';

// TypeScript interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  school?: string;
  currentYear?: string;
  sport?: string;
  position?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  school: { type: String, required: false },
  currentYear: { type: String, required: false },
  sport: { type: String, required: false },
  position: {type: String, required: false },
}, {
  timestamps: true //makes created at and updatedAt fields automatically
});

export default model<IUser>('User', UserSchema);