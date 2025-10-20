import { Router } from 'express';
import { login, me, logout, changeOwnPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', protect, me);
router.post('/logout', protect, logout);
router.post('/change-password', protect, changeOwnPassword);

export default router;