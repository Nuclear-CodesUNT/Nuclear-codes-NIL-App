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
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields
