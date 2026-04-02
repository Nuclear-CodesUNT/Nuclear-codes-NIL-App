import { Schema, model, Document, Types } from 'mongoose';

export interface IAthlete extends Document {
  userId: Types.ObjectId;
  school: string;
  currentYear: string;
  sport?: string;
  position?: string;
  teamName?: string;
  location?: string;
  stats?: Map<string, string>;
  profilepicture?: string;
  bio?: string;
  highlights?: {
    _id?: Types.ObjectId;
    videoId: Types.ObjectId;
    gameDayId: Types.ObjectId;
    addedAt: Date;
  }[];
  gameDays?: {
    _id?: Types.ObjectId;
    date: Date;
    homeAway: "Home" | "Away";
    opponent: string;
  }[];

}

const AthleteSchema = new Schema<IAthlete>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  school: { type: String, default: "" },
  currentYear: { type: String, default: "" },
  sport: { type: String, required: false },
  position: { type: String, required: false },
  teamName: { type: String, default: "" },
  location: { type: String, default: "" },
  stats: { type: Map, of: String, default: {} },
  profilepicture: { type: String, default: "" },
  bio: { type: String, default: "" },
  highlights: [
    {
      videoId: { type: Schema.Types.ObjectId, ref: 'Videos', required: true },
      gameDayId: { type: Schema.Types.ObjectId, required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  gameDays: [
    {
      date: { type: Date, required: true },
      homeAway: { type: String, enum: ["Home", "Away"], required: true },
      opponent: { type: String, required: true },
    }
  ]

}, {
  timestamps: true
});

export default model<IAthlete>('Athlete', AthleteSchema);