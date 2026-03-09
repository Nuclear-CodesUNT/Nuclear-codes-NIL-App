import { Router } from 'express';
import { getAllUsersHandler, getUserHandler } from '../controllers/userController.js';
import { isAuthenticated, hasRole } from '../middleware/auth.js';

const router = Router();

// Protect all routes below with authentication and role check
router.use(isAuthenticated);
router.use(hasRole(['admin', 'lawyer']));

router.get('/', getAllUsersHandler);
router.get('/:id', getUserHandler);

export default router;
