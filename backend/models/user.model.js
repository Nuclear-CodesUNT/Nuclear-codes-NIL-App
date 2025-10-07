import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // -- Common fields for all users --
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    bio: { type: String, default: '' }, 
    // profilePicture TBD
    role: {
        type: String,
        required: true,
        enum: ['athlete', 'coach', 'lawyer'] // TBD: admin, company
    },

    // -- Role-specific fields --
    // Athlete:
    schoolEmail: { type: String },
    stats: { type: Map, of: String },
    highlights: [{ type: String }], // Array of references to highlight media

    // Coach:
    team: { type: String },
    experience: [{ type: String }],

    // Lawyer:
    firm: { type: String },

}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

