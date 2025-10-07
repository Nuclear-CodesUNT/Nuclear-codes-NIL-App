const express = require('express');
const { getUserProfile } = require('../controllers/user.controller/js');
const router = express.Router();

// Route to get logged-in user profile
router.get('/profile', getUserProfile);

// Route to update logged-in user profile
router.put('/profile', updateUserProfile);

module.exports = router;
