// routes/boardRoutes.js
import express from 'express';
import upload from '../middleware/upload.js';
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
router.post('/', upload.single('photo'), createMember);
router.put('/:id', upload.single('photo'), updateMember);
router.delete('/:id', deleteMember);

export default router;
