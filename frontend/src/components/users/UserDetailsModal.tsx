import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, Mail, MapPin, Calendar, Star, Store, ShieldCheck } from 'lucide-react';
import type { User } from '../../types';
import { useData } from '../../context/DataContext';
import { RatingStars } from '../ui/RatingStars';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  const { stores, getStoreDistribution } = useData();

  if (!isOpen || !user) return null;

  const ownedStore = stores.find((s) => s.ownerId === user.id || s.id === user.storeId);
  const distribution = ownedStore ? getStoreDistribution(ownedStore.id) : [];

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
          className="relative w-full max-w-xl bg-white rounded-3xl p-8 shadow-soft-lg border border-borderSoft max-h-[90vh] overflow-y-auto z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 text-muted hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Profile Header */}
          <div className="flex items-start gap-5 mb-6 pb-6 border-b border-borderSoft">
            <div className="w-16 h-16 rounded-3xl bg-pastel-blue border-2 border-brand/20 flex items-center justify-center font-heading font-bold text-2xl text-primary shrink-0 shadow-soft">
              {user.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-heading font-bold text-primary">{user.name}</h2>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    user.role === 'SYSTEM_ADMIN'
                      ? 'bg-brand/10 text-brand'
                      : user.role === 'STORE_OWNER'
                      ? 'bg-brandSecondary/10 text-brandSecondary'
                      : 'bg-pastel-blue text-primary'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-muted flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50/70 p-4 rounded-2xl border border-borderSoft">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                Address
              </span>
              <p className="text-sm text-primary flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                {user.address || 'No address provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-borderSoft">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                  Member Since
                </span>
                <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {user.createdAt}
                </p>
              </div>

              <div className="bg-gray-50/70 p-4 rounded-2xl border border-borderSoft">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                  Account Status
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified & Active
                </span>
              </div>
            </div>
          </div>

          {/* Store Owner Special Section */}
          {user.role === 'STORE_OWNER' && ownedStore && (
            <div className="p-5 rounded-2xl bg-pastel-apricot/30 border border-orange-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-amber-800" />
                  <div>
                    <h4 className="font-heading font-bold text-primary text-base">{ownedStore.name}</h4>
                    <p className="text-xs text-muted">{ownedStore.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl shadow-2xs border border-orange-200/60">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-sm text-primary">{ownedStore.averageRating.toFixed(1)}</span>
                  <span className="text-xs text-muted">({ownedStore.totalRatings} ratings)</span>
                </div>
              </div>

              {/* Visual Rating Breakdown */}
              <h5 className="text-xs font-heading font-bold uppercase tracking-wider text-amber-950 mb-2.5">
                Rating Breakdown
              </h5>
              <div className="space-y-2 bg-white/80 p-4 rounded-xl border border-orange-100">
                {distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-3 text-xs">
                    <span className="w-7 font-bold text-primary flex items-center gap-0.5">
                      {d.star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${d.percentage}%` }}
                        transition={{ duration: 0.5, delay: d.star * 0.05 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    <span className="w-9 text-right font-semibold text-muted">{d.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 font-heading font-medium text-sm text-primary transition-colors"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
