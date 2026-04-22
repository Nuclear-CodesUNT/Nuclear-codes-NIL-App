import { Router } from 'express';
import { getAllUsersHandler, getUserHandler } from '../controllers/userController.js';
import { isAuthenticated, hasRole } from '../middleware/auth.js';
import { deleteUserHandler } from '../controllers/userController.js';
import { banUserHandler } from '../controllers/userController.js';
import { unbanUserHandler } from '../controllers/userController.js';


const router = Router();

// Protect all routes below with authentication and role check
router.use(isAuthenticated);
router.use(hasRole(['admin', 'lawyer']));

router.get('/', getAllUsersHandler);
router.get('/:id', getUserHandler);

router.delete('/:id', deleteUserHandler);

router.post('/:id/ban', banUserHandler);
router.post('/:id/unban', unbanUserHandler);

export default router;