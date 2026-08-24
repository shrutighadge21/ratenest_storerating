import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, Sparkles, Store as StoreIcon, RefreshCw, X } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

import { StoreCard } from '../components/stores/StoreCard';
import { RatingModal } from '../components/ratings/RatingModal';
import { useData } from '../context/DataContext';
import type { Store } from '../types';

const CATEGORIES = [
  'All Stores',
  'Cafe & Bakery',
  'Bookstore & Gifts',
  'Plants & Decor',
  'Sports & Outdoors',
  'Home & Furniture',
  'Fashion & Apparel',
  'Electronics & Tech',
];

export function StoreDiscoveryPage() {
  const { stores } = useData();

  const [nameQuery, setNameQuery] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Stores');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [ratingTargetStore, setRatingTargetStore] = useState<Store | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const filteredStores = useMemo(() => {
    return stores
      .filter((store) => {
        const matchesName = store.name.toLowerCase().includes(nameQuery.toLowerCase());
        const matchesAddress = store.address.toLowerCase().includes(addressQuery.toLowerCase());
        const matchesCat = selectedCategory === 'All Stores' || store.category === selectedCategory;
        return matchesName && matchesAddress && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.averageRating - a.averageRating;
        if (sortBy === 'reviews') return b.totalRatings - a.totalRatings;
        return a.name.localeCompare(b.name);
      });
  }, [stores, nameQuery, addressQuery, selectedCategory, sortBy]);

  const handleOpenRate = (store: Store) => {
    setRatingTargetStore(store);
    setIsRatingModalOpen(true);
  };

  const handleClearFilters = () => {
    setNameQuery('');
    setAddressQuery('');
    setSelectedCategory('All Stores');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-pastel-blue">
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full">
        {/* Header Hero Section */}
        <div className="mb-6 max-w-2xl border-b border-borderSoft pb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-heading font-bold text-primary mb-2 tracking-tight">
              Directory
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              Explore local stores and authentic community ratings.
            </p>
          </motion.div>
        </div>

        {/* Search & Filter Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-5 rounded-3xl shadow-soft border border-borderSoft mb-8 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search by Name */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                placeholder="Search by store name..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50/80 border border-borderSoft/80 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:bg-white transition-all placeholder:text-muted"
              />
              {nameQuery && (
                <button
                  onClick={() => setNameQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search by Address */}
            <div className="md:col-span-4 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={addressQuery}
                onChange={(e) => setAddressQuery(e.target.value)}
                placeholder="Search by address or district..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50/80 border border-borderSoft/80 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:bg-white transition-all placeholder:text-muted"
              />
              {addressQuery && (
                <button
                  onClick={() => setAddressQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Control */}
            <div className="md:col-span-3 flex items-center gap-2">
              <div className="relative w-full">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50/80 border border-borderSoft/80 text-sm font-heading font-medium text-primary focus:outline-none focus:ring-2 focus:ring-pastel-blue transition-all appearance-none cursor-pointer"
                >
                  <option value="rating">Highest Rated ★</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="name">Store Name (A-Z)</option>
                </select>
                <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-medium transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-gray-100 text-muted hover:text-primary hover:bg-gray-200/70'
                }`}
              >
                {cat}
              </button>
            ))}

            {(nameQuery || addressQuery || selectedCategory !== 'All Stores') && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 ml-auto shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </motion.div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs font-heading font-semibold text-muted uppercase tracking-wider">
            Showing {filteredStores.length} {filteredStores.length === 1 ? 'store' : 'stores'} found
          </p>
        </div>

        {/* Store Grid */}
        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} onRate={handleOpenRate} />
            ))}
          </div>
        ) : (
          /* Custom Illustrated Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 px-6 bg-white rounded-3xl border border-borderSoft shadow-soft text-center max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-pastel-apricot/60 text-amber-900 flex items-center justify-center mx-auto mb-4">
              <StoreIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-heading font-bold text-primary mb-2">No matching stores found</h3>
            <p className="text-sm text-muted mb-6">
              We couldn't find any stores matching your current search terms or category filter.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-gray-800 transition-colors shadow-soft"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </main>

      {/* Rating Interaction Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        store={ratingTargetStore}
      />
    </div>
  );
}
