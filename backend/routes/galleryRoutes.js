// routes/galleryRoutes.js
import express from 'express';
import upload from '../middleware/upload.js';
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
router.post('/', upload.single('image'), createImage);
router.put('/:id', upload.single('image'), updateImage);
router.delete('/:id', deleteImage);

export default router;
