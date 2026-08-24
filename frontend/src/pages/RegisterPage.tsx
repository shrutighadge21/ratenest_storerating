import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Star, Eye, EyeOff, Check, X as XIcon, ArrowRight, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Dynamic Password Validation Rules
  const hasMinLength = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasSpecialChar;

  // Name Validation
  const isNameLengthValid = name.trim().length >= 20 && name.trim().length <= 60;

  // Address Validation
  const isAddressValid = address.trim().length > 0 && address.trim().length <= 400;

  // Confirm Password Match
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) {
      errs.name = 'Full name is required.';
    } else if (name.trim().length < 20 || name.trim().length > 60) {
      errs.name = 'Full name must be between 20 and 60 characters.';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!address.trim()) {
      errs.address = 'Address is required.';
    } else if (address.trim().length > 400) {
      errs.address = 'Address must not exceed 400 characters.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (!isPasswordValid) {
      errs.password = 'Password must meet all 3 security requirements.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await register({
        name,
        email,
        address,
        password,
      });

      if (!res.success) {
        setErrors({ general: res.error || 'Registration failed. Please try again.' });
      } else {
        setIsSuccess(true);
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please check your details.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* LEFT PANEL: Deep Teal Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-5/12 bg-brand p-12 flex-col justify-between relative overflow-hidden text-white shadow-2xl">
        {/* Subtle geometric pattern / accents using Terracotta and Amber */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brandSecondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -translate-x-1/4 translate-y-1/4" />
        
        <div className="relative z-10">
          <Link to="/login" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-white text-brand flex items-center justify-center shadow-md">
              <Star className="w-5 h-5 fill-brand" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-bold text-2xl tracking-tight text-white">Rate</span>
              <span className="font-heading font-light text-2xl text-white/80">Nest</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-sm mt-12">
          <h1 className="text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-[1.1] mb-6">
            Join the <br />
            <span className="text-amber-400">Community.</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Create an account to start sharing your experiences and discovering authentic local businesses.
          </p>
          
          <div className="space-y-5 text-sm font-medium text-white/90">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-sm">
                <Compass className="w-5 h-5 text-amber-300" />
              </div>
              Find hidden local gems
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-sm">
                <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              Read verified customer experiences
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              Support trusted businesses
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/50 font-medium">
          &copy; {new Date().getFullYear()} RateNest Platform. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL: Auth Workspace */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 bg-background relative overflow-y-auto">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden">
          <Link to="/login" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center shadow-sm">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-heading font-bold text-lg tracking-tight text-brand">Rate</span>
              <span className="font-heading font-light text-lg text-brand/70">Nest</span>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-lg pt-16 lg:pt-0 pb-8">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 sm:p-10 text-center shadow-soft border border-borderSoft"
              >
                <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-text mb-3">
                  Account created!
                </h2>
                <p className="text-textLight mb-8">
                  Your RateNest profile is ready. You can now sign in and explore the community.
                </p>
                <button
                  onClick={() => navigate('/login', { state: { prefilledEmail: email } })}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand hover:bg-brand/90 text-white font-semibold shadow-md transition-all group"
                >
                  Continue to Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 sm:p-10 shadow-soft border border-borderSoft relative"
              >
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text tracking-tight mb-2">
                    Create an account
                  </h2>
                  <p className="text-sm text-textLight">
                    Join RateNest as a normal user. (Stores are created by admins.)
                  </p>
                </div>

                {errors.general && (
                  <div className="mb-6 p-4 rounded-xl bg-brandSecondary/10 border border-brandSecondary/20 flex gap-3 text-sm text-brandSecondary">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <p>{errors.general}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      placeholder="Enter your full name (20-60 chars)"
                      className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/10 ${
                        errors.name
                          ? 'border-brandSecondary bg-brandSecondary/5'
                          : isNameLengthValid
                          ? 'border-brand/40 bg-white'
                          : 'border-borderSoft bg-background/50 hover:border-gray-300'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-brandSecondary mt-1.5 font-medium">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder="you@example.com"
                      className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/10 ${
                        errors.email
                          ? 'border-brandSecondary bg-brandSecondary/5'
                          : 'border-borderSoft bg-background/50 hover:border-gray-300'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-brandSecondary mt-1.5 font-medium">{errors.email}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                      }}
                      placeholder="City or full address"
                      className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/10 ${
                        errors.address
                          ? 'border-brandSecondary bg-brandSecondary/5'
                          : isAddressValid
                          ? 'border-brand/40 bg-white'
                          : 'border-borderSoft bg-background/50 hover:border-gray-300'
                      }`}
                    />
                    {errors.address && <p className="text-xs text-brandSecondary mt-1.5 font-medium">{errors.address}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                        }}
                        placeholder="••••••••"
                        className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/10 ${
                          errors.password ? 'border-brandSecondary bg-brandSecondary/5' : 'border-borderSoft bg-background/50 hover:border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-textLight hover:text-brand transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Live Visual Password Requirements Checklist */}
                    <div className="mt-3 p-4 rounded-xl bg-background/50 border border-borderSoft space-y-2 text-xs">
                      <p className="font-semibold text-text mb-2">Password requirements:</p>
                      <div className={`flex items-center gap-2 ${hasMinLength ? 'text-brand' : 'text-textLight'}`}>
                        {hasMinLength ? (
                          <Check className="w-4 h-4 text-brand stroke-[3]" />
                        ) : (
                          <span className="w-4 h-4 flex items-center justify-center">○</span>
                        )}
                        <span>8–16 characters</span>
                      </div>
                      <div className={`flex items-center gap-2 ${hasUppercase ? 'text-brand' : 'text-textLight'}`}>
                        {hasUppercase ? (
                          <Check className="w-4 h-4 text-brand stroke-[3]" />
                        ) : (
                          <span className="w-4 h-4 flex items-center justify-center">○</span>
                        )}
                        <span>At least one uppercase letter</span>
                      </div>
                      <div className={`flex items-center gap-2 ${hasSpecialChar ? 'text-brand' : 'text-textLight'}`}>
                        {hasSpecialChar ? (
                          <Check className="w-4 h-4 text-brand stroke-[3]" />
                        ) : (
                          <span className="w-4 h-4 flex items-center justify-center">○</span>
                        )}
                        <span>At least one special character</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                        }}
                        placeholder="••••••••"
                        className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/10 ${
                          errors.confirmPassword || passwordsMismatch
                            ? 'border-brandSecondary bg-brandSecondary/5'
                            : passwordsMatch
                            ? 'border-brand/40 bg-white'
                            : 'border-borderSoft bg-background/50 hover:border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-textLight hover:text-brand transition-colors p-1"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Live Match Feedback */}
                    {passwordsMatch && (
                      <p className="text-xs text-brand mt-1.5 font-medium flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Passwords match
                      </p>
                    )}
                    {passwordsMismatch && (
                      <p className="text-xs text-brandSecondary mt-1.5 font-medium flex items-center gap-1.5">
                        <XIcon className="w-3.5 h-3.5" /> Passwords do not match
                      </p>
                    )}
                    {errors.confirmPassword && !passwordsMismatch && (
                      <p className="text-xs text-brandSecondary mt-1.5 font-medium">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 py-3.5 px-6 rounded-xl bg-brand hover:bg-brand/90 text-white font-heading font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Switch to Login */}
                <div className="text-center mt-6 pt-6 border-t border-borderSoft">
                  <span className="text-xs text-textLight">Already have an account? </span>
                  <Link
                    to="/login"
                    className="text-xs font-heading font-bold text-brand hover:text-brand/80 transition-colors ml-1"
                  >
                    Sign in
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
