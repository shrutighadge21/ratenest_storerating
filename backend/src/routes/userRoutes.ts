import { Router } from 'express';
import { getUsers, createUser, deleteUser, getDashboardStats } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/dashboard', authenticate, authorizeRole('SYSTEM_ADMIN'), getDashboardStats);
router.get('/', authenticate, authorizeRole('SYSTEM_ADMIN'), getUsers);
router.post('/', authenticate, authorizeRole('SYSTEM_ADMIN'), createUser);
router.delete('/:id', authenticate, authorizeRole('SYSTEM_ADMIN'), deleteUser);

export default router;
