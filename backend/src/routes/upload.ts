import { Router } from 'express';
import fileController from '../controllers/fileController.js';

const router = Router();

router.post('/', fileController.uploadSingle, fileController.uploadFile);

router.use(fileController.handleMulterError);

export default router;
