import { Router } from 'express';
import { getStores, getMyStore, createStore, deleteStore } from '../controllers/storeController';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/my-store', authenticate, authorizeRole('STORE_OWNER'), getMyStore);
router.get('/', getStores);
router.post('/', authenticate, authorizeRole('SYSTEM_ADMIN'), createStore);
router.delete('/:id', authenticate, authorizeRole('SYSTEM_ADMIN'), deleteStore);

export default router;
