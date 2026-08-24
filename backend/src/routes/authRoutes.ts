import { Router } from 'express';
import { register, login, updatePassword, getMe, updateProfile } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/password', authenticate, updatePassword);
router.patch('/profile', authenticate, updateProfile);
router.get('/me', authenticate, getMe);

export default router;
