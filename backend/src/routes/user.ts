import { Router } from 'express';
import { getAllUsersHandler, getUserHandler } from '../controllers/userController.js';

const router = Router();
// TODO(human): Add route-level middleware here if you want role-based access control.
router.get('/', getAllUsersHandler);
router.get('/:id', getUserHandler);
export default router;
