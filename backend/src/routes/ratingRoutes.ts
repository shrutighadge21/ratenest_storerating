import { Router } from 'express';
import { submitRating, updateRatingById, getStoreRatings } from '../controllers/ratingController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, submitRating);
router.patch('/:id', authenticate, updateRatingById);
router.get('/:storeId', getStoreRatings);

export default router;
