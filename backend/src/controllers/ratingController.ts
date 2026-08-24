import { Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const submitRating = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { storeId, score } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const numericScore = Number(score);
    if (!storeId || isNaN(numericScore) || numericScore < 1 || numericScore > 5 || !Number.isInteger(numericScore)) {
      return res.status(400).json({ message: 'Rating score must be an integer between 1 and 5' });
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Upsert rating (one rating per user per store enforced by DB unique constraint)
    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        score: numericScore,
        updatedAt: new Date(),
      },
      create: {
        userId,
        storeId,
        score: numericScore,
      },
      include: {
        store: true,
      },
    });

    // Recalculate store average from DB
    const allStoreRatings = await prisma.rating.findMany({
      where: { storeId },
    });

    const totalRatings = allStoreRatings.length;
    const sum = allStoreRatings.reduce((acc, r) => acc + r.score, 0);
    const averageRating = totalRatings > 0 ? Number((sum / totalRatings).toFixed(2)) : 0;

    res.json({
      rating,
      storeAverageRating: averageRating,
      totalRatings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting rating', error });
  }
};

export const updateRatingById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const ratingId = String(req.params.id);
    const { score } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const numericScore = Number(score);
    if (isNaN(numericScore) || numericScore < 1 || numericScore > 5 || !Number.isInteger(numericScore)) {
      return res.status(400).json({ message: 'Rating score must be an integer between 1 and 5' });
    }

    const existingRating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Security check: Only the owner of the rating can modify it
    if (existingRating.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only modify your own rating' });
    }

    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: { score: numericScore },
    });

    // Recalculate store average from DB
    const allStoreRatings = await prisma.rating.findMany({
      where: { storeId: existingRating.storeId },
    });

    const totalRatings = allStoreRatings.length;
    const sum = allStoreRatings.reduce((acc, r) => acc + r.score, 0);
    const averageRating = totalRatings > 0 ? Number((sum / totalRatings).toFixed(2)) : 0;

    res.json({
      rating: updatedRating,
      storeAverageRating: averageRating,
      totalRatings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating rating', error });
  }
};

export const getStoreRatings = async (req: AuthRequest, res: Response) => {
  try {
    const storeId = String(req.params.storeId);
    const ratings = await prisma.rating.findMany({
      where: { storeId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings', error });
  }
};
