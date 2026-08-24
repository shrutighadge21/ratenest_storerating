import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, MapPin, Lock, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import type { UserRole } from '../../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const { addUser } = useData();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('NORMAL_USER');

  const [errors, setErrors] = useState<{ name?: string; email?: string; address?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Dynamic Password Validation Checklist
  const hasMinLength = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasSpecialChar;

  const validate = () => {
    const errs: { name?: string; email?: string; address?: string; password?: string } = {};

    if (name.length < 20 || name.length > 60) {
      errs.name = 'Full name must be between 20 and 60 characters.';
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!address || address.length > 400) {
      errs.address = 'Address is required and cannot exceed 400 characters.';
    }

    if (!isPasswordValid) {
      errs.password = 'Password does not fulfill all security requirements.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addUser({
        name,
        email,
        address,
        password,
        role,
      });

      setIsSubmitting(false);
      showToast('User created successfully!', `${name} has been added as a ${role}.`, 'success');
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
          className="relative w-full max-w-xl bg-white rounded-3xl p-8 shadow-soft-lg border border-borderSoft max-h-[90vh] overflow-y-auto z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 text-muted hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-blue/60 text-purple-900 text-xs font-semibold mb-3">
              <UserPlus className="w-3.5 h-3.5" />
              User Directory Management
            </div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-1">Create Platform User</h2>
            <p className="text-sm text-muted">Add a new administrator, store owner, or normal reviewer.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-sm font-heading font-medium text-primary mb-2">Select User Role</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'NORMAL_USER', label: 'Normal User', accent: 'border-brand/20 bg-pastel-blue/40 text-purple-950' },
                  { id: 'STORE_OWNER', label: 'Store Owner', accent: 'border-orange-200 bg-pastel-apricot/40 text-orange-950' },
                  { id: 'SYSTEM_ADMIN', label: 'Admin', accent: 'border-emerald-200 bg-pastel-sage/40 text-emerald-950' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as UserRole)}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-heading font-semibold transition-all ${
                      role === r.id ? `${r.accent} border-2 shadow-2xs` : 'border-borderSoft text-muted hover:bg-gray-50'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name with Counter */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-heading font-medium text-primary">Full Name *</label>
                <span className={`text-xs ${name.length >= 20 && name.length <= 60 ? 'text-success font-semibold' : 'text-muted'}`}>
                  {name.length} / 60 characters (min 20)
                </span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Lin Robertson"
                className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue transition-colors ${
                  errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-heading font-medium text-primary mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className={`w-full rounded-2xl border pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue transition-colors ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Address with Counter */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-heading font-medium text-primary">Address *</label>
                <span className={`text-xs ${address.length > 400 ? 'text-rose-500 font-bold' : 'text-muted'}`}>
                  {address.length} / 400 characters max
                </span>
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Residential or business address"
                className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue resize-none ${
                  errors.address ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                }`}
              />
              {errors.address && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.address}</p>}
            </div>

            {/* Password with Dynamic Requirements */}
            <div>
              <label className="block text-sm font-heading font-medium text-primary mb-1">Initial Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue transition-colors ${
                    errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                  }`}
                />
              </div>

              {/* Dynamic Checklist */}
              <div className="mt-2.5 p-3 rounded-xl bg-gray-50 border border-borderSoft space-y-1.5">
                <div className={`flex items-center gap-2 text-xs font-medium ${hasMinLength ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>8–16 characters length</span>
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${hasUppercase ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {hasUppercase ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>At least one uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${hasSpecialChar ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {hasSpecialChar ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>At least one special character (!@#$%^&*...)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-borderSoft">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1 bg-primary text-white">
                Create User
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
