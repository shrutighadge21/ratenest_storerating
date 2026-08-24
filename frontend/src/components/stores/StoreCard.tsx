import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Sparkles, Check, ArrowUpRight } from 'lucide-react';
import { RatingStars } from '../ui/RatingStars';
import { Button } from '../ui/Button';
import type { Store } from '../../types';
import { useData } from '../../context/DataContext';

interface StoreCardProps {
  store: Store;
  onRate: (store: Store) => void;
}

const ACCENT_STYLES = {
  lavender: {
    banner: 'bg-pastel-blue border-borderSoft',
    badge: 'bg-white text-primary',
    initial: 'bg-white text-primary',
    button: 'bg-pastel-blue text-primary hover:bg-gray-100',
  },
  peach: {
    banner: 'bg-pastel-apricot border-borderSoft',
    badge: 'bg-white text-primary',
    initial: 'bg-white text-primary',
    button: 'bg-pastel-apricot text-primary hover:bg-gray-100',
  },
  mint: {
    banner: 'bg-pastel-sage border-borderSoft',
    badge: 'bg-white text-primary',
    initial: 'bg-white text-primary',
    button: 'bg-pastel-sage text-primary hover:bg-gray-100',
  },
  blue: {
    banner: 'bg-pastel-blue border-borderSoft',
    badge: 'bg-white text-primary',
    initial: 'bg-white text-primary',
    button: 'bg-pastel-blue text-primary hover:bg-gray-100',
  },
  yellow: {
    banner: 'bg-pastel-apricot border-borderSoft',
    badge: 'bg-white text-primary',
    initial: 'bg-white text-primary',
    button: 'bg-pastel-apricot text-primary hover:bg-gray-100',
  },
  rose: {
    banner: 'bg-pastel-rose border-borderSoft',
    badge: 'bg-white text-primary',
    initial: 'bg-white text-primary',
    button: 'bg-pastel-rose text-primary hover:bg-gray-100',
  },
};

export function StoreCard({ store, onRate }: StoreCardProps) {
  const { getUserRatingForStore } = useData();
  const userRating = getUserRatingForStore(store.id);

  const style = ACCENT_STYLES[store.accentColor] || ACCENT_STYLES.lavender;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl bg-white border border-borderSoft shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Decorative Top Accent Banner */}
      <div className={`h-28 ${style.banner} border-b p-5 relative flex justify-between items-start transition-colors`}>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${style.badge} backdrop-blur-sm shadow-2xs`}>
          {store.category}
        </span>

        {/* User rating pill if already rated */}
        {userRating && (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-emerald-800 shadow-sm border border-emerald-100">
            <Check className="w-3 h-3 text-success stroke-[3]" />
            Your Rating: {userRating.score}★
          </span>
        )}

        {/* Large Initials Logo Avatar */}
        <div className={`absolute -bottom-6 left-6 w-14 h-14 rounded-2xl ${style.initial} border-2 border-white shadow-soft flex items-center justify-center font-heading font-bold text-xl transition-transform group-hover:scale-105`}>
          {store.name.charAt(0)}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 pt-9 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <h3 className="text-xl font-heading font-bold text-primary group-hover:text-gray-900 transition-colors line-clamp-1">
              {store.name}
            </h3>
            <div className="flex items-center gap-1 bg-pastel-apricot/60 px-2 py-0.5 rounded-lg border border-amber-200/50 shrink-0">
              <span className="text-sm font-heading font-bold text-amber-950">{store.averageRating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-rating text-rating" />
            </div>
          </div>

          <p className="text-xs text-muted mb-3 flex items-start gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400 mt-0.5" />
            <span>{store.address}</span>
          </p>

          {store.description && (
            <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {store.description}
            </p>
          )}

          {/* Rating Summary Visualization */}
          <div className="flex items-center gap-2 mb-5 bg-gray-50/80 p-2.5 rounded-xl border border-borderSoft">
            <RatingStars value={Math.round(store.averageRating)} readonly size="sm" />
            <span className="text-xs text-muted font-medium">
              ({store.totalRatings} {store.totalRatings === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => onRate(store)}
            className={`w-full py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-2xs hover:shadow-soft ${
              userRating
                ? 'bg-gray-100 text-primary hover:bg-gray-200'
                : `${style.button}`
            }`}
          >
            {userRating ? (
              <>
                <Sparkles className="w-4 h-4 text-amber-600" />
                Edit Your Rating
              </>
            ) : (
              <>
                <Star className="w-4 h-4" />
                Rate this store
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
