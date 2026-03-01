import { Router } from 'express';
import { signup, login, googleAuth, logout, getMe, completeProfile, forgotPassword, resetPasswordHandler } from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', logout);
router.get('/me', getMe);
router.post('/complete-profile', isAuthenticated, completeProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordHandler);

export default router;
