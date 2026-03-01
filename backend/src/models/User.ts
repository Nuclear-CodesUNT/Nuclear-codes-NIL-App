import { Schema, model, Document } from 'mongoose';

// TypeScript interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: 'athlete' | 'lawyer' | 'coach' | 'admin';
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true},
  role: {
    type: String,
    required: false,
    enum: ['athlete', 'lawyer', 'coach', 'admin']
  },
  resetToken: { type: String, required: false },
  resetTokenExpiry: { type: Date, required: false }
}, {
  timestamps: true //makes created at and updatedAt fields automatically
});

export default model<IUser>('User', UserSchema);