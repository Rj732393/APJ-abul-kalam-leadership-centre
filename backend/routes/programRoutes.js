// routes/programRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} from '../controllers/programController.js';

const router = express.Router();

router.get('/', getAllPrograms);
router.get('/:id', getProgramById);
router.post('/', verifyToken, createProgram);
router.put('/:id', verifyToken, updateProgram);
router.delete('/:id', verifyToken, deleteProgram);

export default router;