// routes/newsRoutes.js
import express from 'express';
import upload from '../middleware/upload.js';
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
router.post('/', upload.single('image'), createNews);
router.put('/:id', upload.single('image'), updateNews);
router.delete('/:id', deleteNews);

export default router;
