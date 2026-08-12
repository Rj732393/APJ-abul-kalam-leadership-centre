// routes/galleryRoutes.js
import express from 'express';
import upload from '../middleware/upload.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getAllImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage
} from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', getAllImages);
router.get('/:id', getImageById);
router.post('/', verifyToken, upload.single('image'), createImage);
router.put('/:id', verifyToken, upload.single('image'), updateImage);
router.delete('/:id', verifyToken, deleteImage);

export default router;