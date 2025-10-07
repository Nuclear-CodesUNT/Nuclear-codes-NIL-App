const User = require('../models/user.model.js');

// -- Get logged-in user profile --
const getUserProfile = async (req, res) => {
    try {
        const userId = "REPLACE_WITH_AUTH_TOKEN"; // placeholder for auth token
        const user = await User.findById(userID).select("-password");
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUserProfile: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
