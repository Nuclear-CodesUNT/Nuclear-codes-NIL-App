import { Schema, model, Document } from 'mongoose';

// TypeScript interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'athlete' | 'lawyer' | 'coach' | 'admin';
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['athlete', 'lawyer', 'coach', 'admin']
  }
}, {
  timestamps: true //makes created at and updatedAt fields automatically
});

export default model<IUser>('User', UserSchema);