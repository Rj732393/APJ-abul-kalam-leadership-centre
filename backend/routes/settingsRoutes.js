// routes/settingsRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', verifyToken, updateSettings);

export default router;