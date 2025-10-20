import { Router } from 'express';
import { protect, permit } from '../middleware/auth.js';
import { requestReset, listResets, setNewPassword, rejectReset } from '../controllers/resetController.js';

const router = Router();

// Public for users to request reset
router.post('/request', requestReset);

// Superadmin console
router.get('/', protect, permit('superadmin'), listResets);
router.post('/set', protect, permit('superadmin'), setNewPassword);
router.post('/reject', protect, permit('superadmin'), rejectReset);

export default router;
