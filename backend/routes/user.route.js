const express = require('express');
const { getUserProfile } = require('../controllers/user.controller/js');
const router = express.Router();

// Route to get logged-in user profile
router.get('/profile', getUserProfile);

module.exports = router;
