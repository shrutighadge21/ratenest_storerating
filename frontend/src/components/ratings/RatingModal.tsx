import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import type { Store } from '../../types';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Not for me',
  2: 'Could be better',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

export function RatingModal({ isOpen, onClose, store }: RatingModalProps) {
  const { submitRating, getUserRatingForStore } = useData();
  const { showToast } = useToast();

  const [selectedScore, setSelectedScore] = useState<number>(5);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const existingRating = store ? getUserRatingForStore(store.id) : undefined;

  useEffect(() => {
    if (store && isOpen) {
      const existing = getUserRatingForStore(store.id);
      if (existing) {
        setSelectedScore(existing.score);
        setComment(existing.comment || '');
      } else {
        setSelectedScore(5);
        setComment('');
      }
      setIsSuccess(false);
    }
  }, [store, isOpen]);

  if (!isOpen || !store) return null;

  const activeScore = hoverScore !== null ? hoverScore : selectedScore;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedScore < 1 || selectedScore > 5) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitRating(store.id, selectedScore, comment);
      setIsSubmitting(false);
      setIsSuccess(true);
      showToast(
        existingRating ? 'Rating updated!' : 'Rating submitted successfully!',
        `You gave ${store.name} a ${selectedScore}/5 score.`,
        'success'
      );
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-soft-lg border border-borderSoft overflow-hidden z-10"
        >
          {/* Subtle pastel decorative background accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-pastel-blue/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pastel-apricot/30 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 text-muted hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-pastel-sage text-emerald-700 flex items-center justify-center mb-4 shadow-soft">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-2">Thank you!</h3>
              <p className="text-muted">Your review for <span className="font-semibold text-primary">{store.name}</span> has been published.</p>
            </motion.div>
          ) : (
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-apricot/50 text-amber-900 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  {existingRating ? 'Edit Your Rating' : 'New Experience Rating'}
                </div>
                <h2 className="text-2xl font-heading font-bold text-primary mb-1">
                  How was your experience?
                </h2>
                <p className="text-sm text-muted">
                  Share your thoughts about <span className="font-medium text-primary">{store.name}</span>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 5-Star Interactive Rating Selector */}
                <div className="bg-gray-50/80 p-6 rounded-2xl border border-borderSoft flex flex-col items-center justify-center">
                  <div
                    className="flex items-center gap-2.5 mb-3"
                    onMouseLeave={() => setHoverScore(null)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= activeScore;
                      return (
                        <motion.button
                          type="button"
                          key={star}
                          whileHover={{ scale: 1.25, rotate: 6 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setHoverScore(star)}
                          onClick={() => setSelectedScore(star)}
                          className="p-1 focus:outline-none transition-transform"
                        >
                          <Star
                            className={`w-10 h-10 transition-colors ${
                              isFilled
                                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                : 'fill-gray-200 text-gray-300'
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Rating Label & Count */}
                  <motion.div
                    key={activeScore}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <span className="font-heading font-bold text-lg text-primary">
                      You rated this store {activeScore} / 5
                    </span>
                    <p className="text-xs text-muted font-medium mt-0.5">
                      {RATING_LABELS[activeScore]}
                    </p>
                  </motion.div>
                </div>

                {/* Review comment */}
                <div>
                  <label className="block text-sm font-heading font-medium text-primary mb-1.5">
                    Your Review (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Tell the community what made this store special, service quality, recommendations..."
                    className="w-full rounded-2xl border border-borderSoft bg-white p-3.5 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-pastel-blue transition-colors resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    className="flex-1 bg-primary hover:bg-gray-900 text-white font-semibold py-3"
                  >
                    {existingRating ? 'Update Rating' : 'Submit Rating'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
