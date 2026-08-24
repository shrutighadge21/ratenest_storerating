import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Store, Sparkles, Building2, Mail, MapPin, User, Palette } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStoreModal({ isOpen, onClose }: AddStoreModalProps) {
  const { addStore, users } = useData();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('Cafe & Bakery');
  const [ownerId, setOwnerId] = useState(users[2]?.id || '');
  const [accentColor, setAccentColor] = useState<'lavender' | 'peach' | 'mint' | 'blue' | 'yellow' | 'rose'>('lavender');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<{ name?: string; email?: string; address?: string; ownerId?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { name?: string; email?: string; address?: string; ownerId?: string } = {};

    if (name.length < 20 || name.length > 60) {
      errs.name = 'Store name must be between 20 and 60 characters.';
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid business email address.';
    }

    if (!address || address.length > 400) {
      errs.address = 'Address is required and must not exceed 400 characters.';
    }
    
    if (!ownerId) {
      errs.ownerId = 'You must assign a Store Owner.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const selectedOwner = users.find((u) => u.id === ownerId);

    setTimeout(async () => {
      await addStore({
        name,
        email,
        address,
        category,
        ownerId: selectedOwner?.id || '',
        accentColor,
        description,
      });

      setIsSubmitting(false);
      showToast('Store created successfully!', `${name} is now registered on the platform.`, 'success');
      onClose();
    }, 500);
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
          className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-soft-lg border border-borderSoft max-h-[90vh] overflow-y-auto z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 text-muted hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-sage/60 text-emerald-900 text-xs font-semibold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              Store Directory Management
            </div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-1">Add New Store</h2>
            <p className="text-sm text-muted">Register a new store into the community rating platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Store Name with Counter */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-heading font-medium text-primary">Store Name *</label>
                <span className={`text-xs ${name.length >= 20 && name.length <= 60 ? 'text-success font-semibold' : 'text-muted'}`}>
                  {name.length} / 60 characters (min 20)
                </span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Artisan Specialty Coffee Roasters & Bakery"
                className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-sage transition-colors ${
                  errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Email & Category row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-heading font-medium text-primary mb-1">Business Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@storename.com"
                    className={`w-full rounded-2xl border pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-sage transition-colors ${
                      errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-heading font-medium text-primary mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-sage"
                >
                  <option>Cafe & Bakery</option>
                  <option>Bookstore & Gifts</option>
                  <option>Plants & Decor</option>
                  <option>Sports & Outdoors</option>
                  <option>Home & Furniture</option>
                  <option>Fashion & Apparel</option>
                  <option>Electronics & Tech</option>
                </select>
              </div>
            </div>

            {/* Address with Counter */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-heading font-medium text-primary">Store Address *</label>
                <span className={`text-xs ${address.length > 400 ? 'text-rose-500 font-bold' : 'text-muted'}`}>
                  {address.length} / 400 characters max
                </span>
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Full street address, district, suite/unit number, city and postal code"
                className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-sage resize-none ${
                  errors.address ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                }`}
              />
              {errors.address && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.address}</p>}
            </div>

            {/* Owner & Theme Color Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-heading font-medium text-primary mb-1">Assign Store Owner</label>
                {users.filter(u => u.role === 'STORE_OWNER').length > 0 ? (
                  <select
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-sage"
                  >
                    <option value="">Select Store Owner...</option>
                    {users
                      .filter((u) => u.role === 'STORE_OWNER')
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} — {u.email}
                        </option>
                      ))}
                  </select>
                ) : (
                  <div className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 font-medium flex items-center">
                    No Store Owners available. Create one first.
                  </div>
                )}
                {errors.ownerId && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.ownerId}</p>}
              </div>

              <div>
                <label className="block text-sm font-heading font-medium text-primary mb-1">Pastel Visual Theme</label>
                <div className="flex items-center gap-2 pt-1">
                  {(['lavender', 'peach', 'mint', 'blue', 'yellow', 'rose'] as const).map((col) => (
                    <button
                      type="button"
                      key={col}
                      onClick={() => setAccentColor(col)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        accentColor === col ? 'scale-110 border-primary shadow-sm' : 'border-transparent hover:scale-105'
                      } ${
                        col === 'lavender' ? 'bg-pastel-blue' :
                        col === 'peach' ? 'bg-pastel-apricot' :
                        col === 'mint' ? 'bg-pastel-sage' :
                        col === 'blue' ? 'bg-pastel-blue' :
                        col === 'yellow' ? 'bg-pastel-apricot' : 'bg-rose-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-heading font-medium text-primary mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short tagline or key highlight of the store"
                className="w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-sage"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-borderSoft">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1 bg-primary text-white">
                Create Store
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
