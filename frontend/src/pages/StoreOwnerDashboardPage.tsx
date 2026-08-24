import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  TrendingUp,
  Users,
  Sparkles,
  Award,
  ArrowUpRight,
  MessageSquare,
  Clock,
  ThumbsUp,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';

import { RatingStars } from '../components/ui/RatingStars';
import { storesApi } from '../services/api';
import type { Store, Rating } from '../types';

const PIE_COLORS = ['#397C78', '#E8B84A', '#C97862', '#69757A', '#E2E5E3'];

export function StoreOwnerDashboardPage() {
  const [store, setStore] = useState<Store | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyStore = async () => {
      try {
        const data = await storesApi.getMyStore();
        setStore(data);
        if (data.ratings) {
          setRatings(data.ratings);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('No store assigned. Please contact the System Administrator to assign a store to your account.');
        } else {
          setError('Failed to load store dashboard.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyStore();
  }, []);

  const getStoreDistribution = () => {
    if (!ratings.length) return [];
    const total = ratings.length;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = ratings.filter((r) => r.score === star).length;
      return {
        star,
        count,
        percentage: Math.round((count / total) * 100),
      };
    });
  };

  const distribution = getStoreDistribution();

  const pieData = distribution.map((d) => ({
    name: `${d.star} Stars`,
    value: d.count,
    percentage: d.percentage,
  }));

  const fiveStarPercent = distribution.find(d => d.star === 5)?.percentage || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col selection:bg-pastel-apricot">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted">Loading your store dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-background flex flex-col selection:bg-pastel-apricot">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-red-100 shadow-soft text-center">
            <h2 className="text-xl font-bold text-red-900 mb-2">Access Denied</h2>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-pastel-apricot">
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1 space-y-8">
        {/* Header Hero Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pastel-apricot/60 text-amber-900 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              Store Performance & Reputation Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary tracking-tight">
              {store ? store.name : 'Your Store'}
            </h1>
            <p className="text-sm text-muted">
              Live feedback analytics, consumer ratings, and performance insights.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-borderSoft shadow-soft">
            <span className="flex h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-heading font-semibold text-primary">Live Data Connected</span>
          </div>
        </div>

        {/* Hero Section & Radial Rating Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Average Rating Metric Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-borderSoft shadow-soft relative overflow-hidden flex flex-col justify-between"
          >
            {/* Background Pastel Aura */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-pastel-apricot/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-pastel-apricot/30 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-muted">
                    Store Reputation Score
                  </span>
                  <h3 className="text-xl font-heading font-bold text-primary mt-1">Average Customer Rating</h3>
                </div>
                <div className="p-3 bg-pastel-apricot/70 rounded-2xl text-amber-900 border border-amber-200/60 shadow-2xs">
                  <Star className="w-6 h-6 fill-rating text-rating" />
                </div>
              </div>

              {/* Large Visual Score */}
              <div className="flex flex-col sm:flex-row items-baseline gap-4 mb-4">
                <span className="text-6xl sm:text-7xl font-heading font-extrabold text-primary tracking-tight">
                  {store ? store.averageRating.toFixed(1) : '0.0'}
                </span>
                <div className="flex flex-col">
                  <RatingStars value={Math.round(store ? store.averageRating : 0)} readonly size="lg" />
                  <span className="text-sm font-medium text-muted mt-1">
                    Based on {store ? store.totalRatings : 0} verified community ratings
                  </span>
                </div>
              </div>
            </div>

            {/* Quick KPI Stat Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 relative z-10 pt-6 border-t border-borderSoft">
              <div className="bg-gray-50/80 p-4 rounded-2xl border border-borderSoft flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pastel-sage text-emerald-800 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted font-medium">Community Status</p>
                  <p className="text-sm font-heading font-bold text-primary">Active</p>
                </div>
              </div>

              <div className="bg-gray-50/80 p-4 rounded-2xl border border-borderSoft flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pastel-blue text-purple-900 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted font-medium">Total Reviewers</p>
                  <p className="text-sm font-heading font-bold text-primary">{store ? store.totalRatings : 0} verified ratings</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Rating Distribution Donut / Progress */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5 p-8 rounded-3xl bg-white border border-borderSoft shadow-soft flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-heading font-bold text-primary mb-1">Rating Breakdown</h3>
              <p className="text-xs text-muted mb-4">Distribution of scores across 1 to 5 stars</p>
            </div>

            <div className="h-52 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-heading font-bold text-primary">{fiveStarPercent}%</span>
                <span className="text-2xs text-muted font-semibold uppercase">5-Star Ratio</span>
              </div>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-2 mt-4">
              {distribution.map((d) => (
                <div key={d.star} className="flex items-center gap-2.5 text-xs">
                  <span className="w-8 font-bold text-primary flex items-center gap-0.5">
                    {d.star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${d.percentage || 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-muted">
                    {d.percentage || 0}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Store Owner Actionable Insights Section */}
        <div>
          <h3 className="text-xl font-heading font-bold text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Performance Insights & Highlights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-pastel-sage/30 border border-emerald-100 shadow-soft">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs text-emerald-800 flex items-center justify-center font-bold mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-primary mb-1">Rating Momentum</h4>
              <p className="text-xs text-muted leading-relaxed">
                Your store currently has a <span className="font-semibold text-emerald-800">{store ? store.averageRating.toFixed(1) : '0'} rating</span> across all community feedback.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-pastel-apricot/30 border border-orange-100 shadow-soft">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs text-amber-900 flex items-center justify-center font-bold mb-3">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-primary mb-1">Customer Sentiment</h4>
              <p className="text-xs text-muted leading-relaxed">
                <span className="font-semibold text-amber-950">{fiveStarPercent}% of customers</span> rated your store 5 stars. Keep up the good work!
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-pastel-blue/30 border border-purple-100 shadow-soft">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs text-purple-900 flex items-center justify-center font-bold mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-primary mb-1">Reviewer Engagement</h4>
              <p className="text-xs text-muted leading-relaxed">
                Your store has received <span className="font-semibold text-purple-950">{ratings.length} total ratings</span> from the community.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Reviewers Feed */}
        <div className="p-8 rounded-3xl bg-white border border-borderSoft shadow-soft">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-heading font-bold text-primary">Recent Community Reviews</h3>
              <p className="text-xs text-muted">Latest feedback submitted by verified customers</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-muted">
              {ratings.length} Reviews
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {ratings.map((rate) => (
              <div key={rate.id} className="py-5 first:pt-0 last:pb-0 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-pastel-blue/50 text-purple-900 flex items-center justify-center font-bold shrink-0">
                  {(rate.userName || (rate as any).user?.name || 'A').charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-heading font-semibold text-primary">{rate.userName || (rate as any).user?.name || 'Anonymous User'}</h4>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(rate.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <RatingStars value={rate.score} readonly size="sm" />
                    <span className="text-xs font-bold text-primary">{rate.score}/5</span>
                  </div>

                  {rate.comment && (
                    <p className="text-xs text-gray-700 bg-gray-50/70 p-3 rounded-xl border border-borderSoft leading-relaxed">
                      "{rate.comment}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
