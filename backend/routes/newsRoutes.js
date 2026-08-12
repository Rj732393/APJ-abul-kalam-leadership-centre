// routes/newsRoutes.js
import express from 'express';
import upload from '../middleware/upload.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController.js';

const router = express.Router();

router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', verifyToken, upload.single('image'), createNews);
router.put('/:id', verifyToken, upload.single('image'), updateNews);
router.delete('/:id', verifyToken, deleteNews);

export default router;