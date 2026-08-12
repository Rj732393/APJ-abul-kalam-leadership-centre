// routes/boardRoutes.js
import express from 'express';
import upload from '../middleware/upload.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} from '../controllers/boardController.js';

const router = express.Router();

router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.post('/', verifyToken, upload.single('photo'), createMember);
router.put('/:id', verifyToken, upload.single('photo'), updateMember);
router.delete('/:id', verifyToken, deleteMember);

export default router;