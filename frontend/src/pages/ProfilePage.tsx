import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Lock, ShieldCheck, Check, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function ProfilePage() {
  const { currentUser, updateProfile, updatePassword, role } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(currentUser?.name || '');
  const [email] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileErrors, setProfileErrors] = useState<{ name?: string; address?: string }>({});
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Dynamic Password Validation
  const hasMinLength = newPassword.length >= 8 && newPassword.length <= 16;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasUppercase && hasSpecialChar;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { name?: string; address?: string } = {};

    if (name.length < 20 || name.length > 60) {
      errs.name = 'Name must be between 20 and 60 characters.';
    }

    if (!address || address.length > 400) {
      errs.address = 'Address cannot exceed 400 characters.';
    }

    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      return;
    }

    setProfileErrors({});
    setIsSavingProfile(true);

    setTimeout(async () => {
      await updateProfile({ name, address });
      setIsSavingProfile(false);
      showToast('Profile updated!', 'Your personal information was saved.', 'success');
    }, 400);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};

    if (!oldPassword) {
      errs.oldPassword = 'Old password is required.';
    }

    if (!isPasswordValid) {
      errs.newPassword = 'Password does not meet the specified security criteria.';
    }

    if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errs).length > 0) {
      setPasswordErrors(errs);
      return;
    }

    setPasswordErrors({});
    setIsSavingPassword(true);

    setTimeout(async () => {
      await updatePassword(oldPassword, newPassword);
      setIsSavingPassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated!', 'Your security credentials have been updated.', 'success');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-pastel-blue">
      
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10 w-full flex-1 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pastel-blue/60 text-purple-900 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Account Management
          </div>
          <h1 className="text-3xl font-heading font-bold text-primary tracking-tight">
            Account Settings & Security
          </h1>
          <p className="text-sm text-muted">
            Manage your personal profile details and update your security settings.
          </p>
        </div>

        {/* Profile Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-white border border-borderSoft shadow-soft"
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-borderSoft">
            <div className="w-16 h-16 rounded-3xl bg-pastel-blue/80 border-2 border-brand/20 flex items-center justify-center font-heading font-bold text-2xl text-primary shadow-2xs">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-primary">{currentUser?.name}</h3>
              <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                <span className="capitalize">{role.replace('_', ' ')}</span> • {currentUser?.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            {/* Name with counter */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-heading font-semibold text-primary">Full Name *</label>
                <span className={`text-xs ${name.length >= 20 && name.length <= 60 ? 'text-success font-semibold' : 'text-muted'}`}>
                  {name.length} / 60 characters (min 20)
                </span>
              </div>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue ${
                    profileErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                  }`}
                />
              </div>
              {profileErrors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{profileErrors.name}</p>}
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-heading font-semibold text-primary mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-borderSoft bg-gray-50 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Address with counter */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-heading font-semibold text-primary">Residential / Business Address *</label>
                <span className={`text-xs ${address.length > 400 ? 'text-rose-500 font-bold' : 'text-muted'}`}>
                  {address.length} / 400 characters max
                </span>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue resize-none ${
                    profileErrors.address ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                  }`}
                />
              </div>
              {profileErrors.address && <p className="text-xs text-rose-500 mt-1 font-medium">{profileErrors.address}</p>}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" isLoading={isSavingProfile} className="bg-primary text-white">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Password & Security Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl bg-white border border-borderSoft shadow-soft"
        >
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-borderSoft">
            <div className="w-10 h-10 rounded-2xl bg-pastel-sage text-emerald-800 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-primary">Change Password</h3>
              <p className="text-xs text-muted">Keep your account secure by using a strong password.</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-semibold text-primary mb-1">Current Password *</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-pastel-sage ${
                  passwordErrors.oldPassword ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                }`}
              />
              {passwordErrors.oldPassword && <p className="text-xs text-rose-500 mt-1 font-medium">{passwordErrors.oldPassword}</p>}
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-primary mb-1">New Password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-pastel-sage ${
                  passwordErrors.newPassword ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                }`}
              />

              {/* Dynamic Requirement Checklist */}
              <div className="mt-3 p-3.5 rounded-2xl bg-gray-50 border border-borderSoft space-y-1.5">
                <div className={`flex items-center gap-2 text-xs font-medium ${hasMinLength ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>8–16 characters long</span>
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${hasUppercase ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {hasUppercase ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>At least one uppercase letter</span>
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${hasSpecialChar ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {hasSpecialChar ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>At least one special character</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-primary mb-1">Confirm New Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-pastel-sage ${
                  passwordErrors.confirmPassword ? 'border-rose-400 bg-rose-50/20' : 'border-borderSoft bg-white'
                }`}
              />
              {passwordErrors.confirmPassword && <p className="text-xs text-rose-500 mt-1 font-medium">{passwordErrors.confirmPassword}</p>}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" isLoading={isSavingPassword} className="bg-primary text-white">
                Update Password
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
