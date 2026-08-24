import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Star, Eye, EyeOff, ArrowRight, ShieldCheck, Building2, UserCircle, HelpCircle, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ name: string; roleText: string } | null>(null);
  const [showDemoHelper, setShowDemoHelper] = useState(false);

  useEffect(() => {
    if (location.state && (location.state as any).prefilledEmail) {
      setEmail((location.state as any).prefilledEmail);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(cleanEmail, cleanPassword);

      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Email or password doesn’t match. Please try again.');
        setIsLoading(false);
        return;
      }

      const roleText =
        res.role === 'SYSTEM_ADMIN'
          ? 'System Administrator'
          : res.role === 'STORE_OWNER'
          ? 'Store Owner'
          : 'Community Explorer';

      setSuccessInfo({ name: res.user.name, roleText });

      setTimeout(() => {
        if (res.role === 'SYSTEM_ADMIN') {
          navigate('/admin');
        } else if (res.role === 'STORE_OWNER') {
          navigate('/store-owner');
        } else {
          navigate('/discovery');
        }
      }, 700);
    } catch {
      setErrorMessage('Unable to connect right now. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const fillQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* LEFT PANEL: Deep Teal Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-5/12 bg-brand p-12 flex-col justify-between relative overflow-hidden text-white shadow-2xl">
        {/* Subtle geometric pattern / accents using Terracotta and Amber */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brandSecondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -translate-x-1/4 translate-y-1/4" />
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 group">
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
            Discover. <br />
            <span className="text-brandSecondary">Rate.</span> <br />
            Trust.
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Your community-driven guide to local stores. Experience authentic ratings and honest reviews.
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
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 bg-background relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center shadow-sm">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-heading font-bold text-lg tracking-tight text-brand">Rate</span>
              <span className="font-heading font-light text-lg text-brand/70">Nest</span>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {successInfo ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 sm:p-10 text-center shadow-soft border border-borderSoft"
              >
                <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Star className="w-8 h-8 fill-brand animate-pulse" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-text mb-2">
                  Welcome back,<br />{successInfo.name}!
                </h2>
                <p className="text-sm text-textLight font-medium mb-1">
                  Logging in as {successInfo.roleText}...
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-6 h-6 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
                </div>
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
                    Welcome Back
                  </h2>
                  <p className="text-sm text-textLight">
                    Sign in to continue exploring RateNest.
                  </p>
                </div>

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-brandSecondary/10 border border-brandSecondary/20 flex gap-3 text-sm text-brandSecondary"
                  >
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <p>{errorMessage}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-borderSoft bg-background/50 px-4 py-3 text-sm text-text placeholder:text-textLight transition-all focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 hover:border-gray-300"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-text uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setErrorMessage('Please contact your administrator or sign in with your preset credentials.')}
                        className="text-xs text-textLight hover:text-brand transition-colors font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="w-full rounded-xl border border-borderSoft bg-background/50 px-4 py-3 pr-11 text-sm text-text placeholder:text-textLight transition-all focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 hover:border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-textLight hover:text-brand transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 py-3.5 px-6 rounded-xl bg-brand hover:bg-brand/90 text-white font-heading font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-6 pt-6 border-t border-borderSoft">
                  <span className="text-xs text-textLight">Don't have an account? </span>
                  <Link
                    to="/register"
                    className="text-xs font-heading font-bold text-brand hover:text-brand/80 transition-colors ml-1"
                  >
                    Register here
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discreet Demo Helper */}
          {!successInfo && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowDemoHelper(!showDemoHelper)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-textLight hover:text-text transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showDemoHelper ? 'Hide test accounts' : 'Need test credentials?'}</span>
              </button>

              <AnimatePresence>
                {showDemoHelper && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-4 rounded-2xl bg-white border border-borderSoft text-left text-xs overflow-hidden shadow-sm"
                  >
                    <p className="font-semibold text-text mb-3">
                      Select a role to test:
                    </p>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => fillQuickDemo('admin@storeratings.io', 'Admin@1234')}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-borderSoft hover:border-brand/40 hover:bg-background transition-all text-left"
                      >
                        <ShieldCheck className="w-5 h-5 text-brand" />
                        <div>
                          <p className="font-bold text-text">System Admin</p>
                          <p className="text-textLight">admin@storeratings.io</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => fillQuickDemo('julian@artisancoffee.co', 'Owner@1234')}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-borderSoft hover:border-brandSecondary/40 hover:bg-background transition-all text-left"
                      >
                        <Building2 className="w-5 h-5 text-brandSecondary" />
                        <div>
                          <p className="font-bold text-text">Store Owner</p>
                          <p className="text-textLight">julian@artisancoffee.co</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => fillQuickDemo('maya.lin@gmail.com', 'User@1234')}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-borderSoft hover:border-brand/40 hover:bg-background transition-all text-left"
                      >
                        <UserCircle className="w-5 h-5 text-brand" />
                        <div>
                          <p className="font-bold text-text">Normal User</p>
                          <p className="text-textLight">maya.lin@gmail.com</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
