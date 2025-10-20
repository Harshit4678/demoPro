import { Router } from 'express';
import { protect, permit } from '../middleware/auth.js';
import { createUser, deleteUser, banUser } from '../controllers/userAdminController.js';

const router = Router();

router.post('/create', protect, permit('superadmin'), createUser);
router.delete('/:id', protect, permit('superadmin'), deleteUser);
router.post('/ban/:id', protect, permit('superadmin'), banUser);

export default router;
