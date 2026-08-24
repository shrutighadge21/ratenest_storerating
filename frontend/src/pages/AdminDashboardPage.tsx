import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Store as StoreIcon,
  Star,
  TrendingUp,
  Search,
  Plus,
  Trash2,
  Eye,
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
  ShieldCheck,
  UserCheck,
  User as UserIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Navbar } from '../components/layout/Navbar';

import { AddStoreModal } from '../components/stores/AddStoreModal';
import { AddUserModal } from '../components/users/AddUserModal';
import { UserDetailsModal } from '../components/users/UserDetailsModal';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import type { Store, User, UserRole } from '../types';


export function AdminDashboardPage() {
  const { stores, users, ratings, deleteStore, deleteUser, adminKPIs } = useData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'stores' | 'users'>('overview');

  // Modals state
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);

  // Stores Table State
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSortBy, setStoreSortBy] = useState<'name' | 'email' | 'rating'>('name');

  // Users Table State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [userSortBy, setUserSortBy] = useState<'name' | 'email' | 'role' | 'address'>('name');

  const allRatings = ratings || [];
  
  const RATINGS_SCORE_DATA = [5, 4, 3, 2, 1].map(star => {
    const fills = ['#1f2937', '#4b5563', '#9ca3af', '#d1d5db', '#f3f4f6'];
    return {
      stars: `${star} ★`,
      count: allRatings.filter(r => r.score === star).length,
      fill: fills[5 - star]
    };
  });

  const USER_ROLE_DATA = [
    { name: 'Reviewers', value: users.filter(u => u.role === 'NORMAL_USER').length || 1, color: '#e6e6fa' },
    { name: 'Store Owners', value: users.filter(u => u.role === 'STORE_OWNER').length || 1, color: '#ffdab9' },
    { name: 'System Admins', value: users.filter(u => u.role === 'SYSTEM_ADMIN').length || 1, color: '#f5fffa' },
  ];

  // Calculate real rating timeline data over the last 7 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  const RATINGS_TIMELINE_DATA = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    return {
      name: days[d.getDay()],
      dateStr: d.toDateString(),
      count: 0
    };
  });

  allRatings.forEach((r) => {
    if (!r.createdAt) return;
    const rDate = new Date(r.createdAt).toDateString();
    const dayData = RATINGS_TIMELINE_DATA.find(d => d.dateStr === rDate);
    if (dayData) {
      dayData.count += 1;
    }
  });

  // Filtered Stores
  const filteredStores = stores
    .filter((s) => s.name.toLowerCase().includes(storeSearch.toLowerCase()) || s.email.toLowerCase().includes(storeSearch.toLowerCase()) || s.address.toLowerCase().includes(storeSearch.toLowerCase()))
    .sort((a, b) => {
      if (storeSortBy === 'rating') return b.averageRating - a.averageRating;
      if (storeSortBy === 'email') return a.email.localeCompare(b.email);
      return a.name.localeCompare(b.name);
    });

  // Filtered Users
  const filteredUsers = users
    .filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()) || (u.address && u.address.toLowerCase().includes(userSearch.toLowerCase()));
      const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (userSortBy === 'email') return a.email.localeCompare(b.email);
      if (userSortBy === 'role') return a.role.localeCompare(b.role);
      if (userSortBy === 'address') return (a.address || '').localeCompare(b.address || '');
      return a.name.localeCompare(b.name);
    });

  const handleDeleteStore = (store: Store) => {
    if (window.confirm(`Are you sure you want to delete ${store.name}?`)) {
      deleteStore(store.id);
      showToast('Store removed', `${store.name} was successfully removed.`, 'info');
    }
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteUser(user.id);
      showToast('User removed', `${user.name} has been removed.`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-pastel-blue">
      
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-1">
              Good morning, Admin.
            </h1>
            <p className="text-sm text-muted">
              Here's what's happening across your platform operations today.
            </p>
          </div>

          {/* Tab navigation pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-borderSoft shadow-2xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-muted hover:text-primary hover:bg-gray-50'
              }`}
            >
              Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all ${
                activeTab === 'stores'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-muted hover:text-primary hover:bg-gray-50'
              }`}
            >
              Stores ({stores.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-muted hover:text-primary hover:bg-gray-50'
              }`}
            >
              Users ({users.length})
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Quick Actions */}
            <div className="flex gap-4 mb-2">
              <button
                onClick={() => setIsAddStoreOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add New Store
              </button>
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-borderSoft text-primary text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                <UserIcon className="w-4 h-4" />
                Add New User
              </button>
            </div>
            {/* Compact KPI Summary Strip */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Primary Metric: Stores */}
              <div className="flex-1 p-5 rounded-2xl bg-brand text-white shadow-soft flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-brand/30 mb-1 text-white/70">Total Stores</p>
                  <h3 className="text-3xl font-heading font-bold">{adminKPIs.totalStores.toLocaleString()}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              {/* Secondary Metric: Users */}
              <div className="flex-1 p-5 rounded-2xl bg-brandSecondary text-white shadow-soft flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white/70 mb-1">Registered Users</p>
                  <h3 className="text-3xl font-heading font-bold">{adminKPIs.totalUsers.toLocaleString()}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Compact Metrics: Ratings & Average */}
              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 p-4 rounded-2xl bg-pastel-blue border border-borderSoft flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Star className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-primary leading-tight">{adminKPIs.totalRatings}</h3>
                    <p className="text-[10px] font-semibold text-muted uppercase">Total Ratings</p>
                  </div>
                </div>

                <div className="flex-1 p-4 rounded-2xl bg-pastel-apricot border border-borderSoft flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-primary leading-tight">{adminKPIs.averageRating}</h3>
                    <p className="text-[10px] font-semibold text-muted uppercase">Global Avg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Timeline Area Chart */}
              <div className="lg:col-span-8 p-7 rounded-3xl bg-white border border-borderSoft shadow-soft">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-primary">Ratings Submitted Over Time</h3>
                    <p className="text-xs text-muted">Weekly trend of consumer review activity</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pastel-blue/60 text-purple-950">
                    Last 7 Days
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={RATINGS_TIMELINE_DATA}>
                      <defs>
                        <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e6e6fa" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#e6e6fa" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-8} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.06)' }} />
                      <Area type="monotone" dataKey="count" stroke="#1f2937" strokeWidth={3} fillOpacity={1} fill="url(#colorArea)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rating Distribution Bar Chart */}
              <div className="lg:col-span-4 p-7 rounded-3xl bg-white border border-borderSoft shadow-soft flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-heading font-bold text-primary mb-1">Platform Score Breakdown</h3>
                  <p className="text-xs text-muted mb-6">Overall rating stars breakdown</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={RATINGS_SCORE_DATA} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="stars" type="category" axisLine={false} tickLine={false} tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 'bold' }} width={45} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                      <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                        {RATINGS_SCORE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-xs text-muted text-center pt-2">
                  72% of all submitted ratings are 5-star ratings.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: STORE MANAGEMENT */}
        {activeTab === 'stores' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header + Add Store Button */}
            <div className="bg-white p-6 rounded-3xl border border-borderSoft shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-heading font-bold text-primary">Store Registry</h3>
                <p className="text-xs text-muted">Manage all registered businesses, view ratings, and update records.</p>
              </div>

              <button
                onClick={() => setIsAddStoreOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-gray-900 text-white text-xs font-heading font-semibold shadow-soft transition-all"
              >
                <Plus className="w-4 h-4" />
                Add New Store
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-borderSoft shadow-2xs flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  placeholder="Filter stores by name, email, or address..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-borderSoft text-xs focus:outline-none focus:ring-2 focus:ring-pastel-sage"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-medium">Sort:</span>
                <select
                  value={storeSortBy}
                  onChange={(e) => setStoreSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-gray-50 border border-borderSoft text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pastel-sage cursor-pointer"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="rating">Rating (Highest)</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-borderSoft shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-borderSoft bg-gray-50/70 text-xs font-heading font-semibold text-muted uppercase tracking-wider">
                      <th className="py-4 px-6">Store Name</th>
                      <th className="py-4 px-6">Business Email</th>
                      <th className="py-4 px-6">Address</th>
                      <th className="py-4 px-6">Avg Rating</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredStores.map((store) => (
                      <tr key={store.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-pastel-blue/60 flex items-center justify-center font-heading font-bold text-sm text-primary">
                              {store.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-heading font-semibold text-primary">{store.name}</p>
                              <p className="text-xs text-muted">{store.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-600 font-mono">{store.email}</td>
                        <td className="py-4 px-6 text-xs text-muted max-w-xs truncate">{store.address}</td>
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-1 bg-pastel-apricot/60 px-2.5 py-1 rounded-lg border border-amber-200/50">
                            <span className="font-bold text-xs text-amber-950">{store.averageRating.toFixed(1)}</span>
                            <Star className="w-3 h-3 fill-rating text-rating" />
                            <span className="text-xs text-muted">({store.totalRatings})</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteStore(store)}
                            className="p-2 rounded-xl text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Store"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header + Add User */}
            <div className="bg-white p-6 rounded-3xl border border-borderSoft shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-heading font-bold text-primary">User Directory</h3>
                <p className="text-xs text-muted">Manage normal users, store owners, and administrators.</p>
              </div>

              <button
                onClick={() => setIsAddUserOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-gray-900 text-white text-xs font-heading font-semibold shadow-soft transition-all"
              >
                <Plus className="w-4 h-4" />
                Add New User
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-borderSoft shadow-2xs flex flex-col md:flex-row justify-between gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users by name, email, or address..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-borderSoft text-xs focus:outline-none focus:ring-2 focus:ring-pastel-blue"
                />
              </div>

              {/* Role Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['ALL', 'SYSTEM_ADMIN', 'STORE_OWNER', 'NORMAL_USER'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-heading font-semibold transition-all shrink-0 ${
                      userRoleFilter === r
                        ? 'bg-primary text-white shadow-2xs'
                        : 'bg-gray-100 text-muted hover:bg-gray-200'
                    }`}
                  >
                    {r === 'ALL' ? 'All Roles' : r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-borderSoft shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-borderSoft bg-gray-50/70 text-xs font-heading font-semibold text-muted uppercase tracking-wider">
                      <th className="py-4 px-6">User Name</th>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Address</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                        onClick={() => setSelectedUserForDetails(user)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-pastel-apricot/60 flex items-center justify-center font-heading font-bold text-sm text-primary">
                              {user.name.charAt(0)}
                            </div>
                            <span className="font-heading font-semibold text-primary">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-600 font-mono">{user.email}</td>
                        <td className="py-4 px-6">
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
                        </td>
                        <td className="py-4 px-6 text-xs text-muted max-w-xs truncate">{user.address || '—'}</td>
                        <td className="py-4 px-6 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedUserForDetails(user)}
                            className="p-2 rounded-xl text-muted hover:text-primary hover:bg-gray-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 rounded-xl text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AddStoreModal isOpen={isAddStoreOpen} onClose={() => setIsAddStoreOpen(false)} />
      <AddUserModal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} />
      <UserDetailsModal
        isOpen={!!selectedUserForDetails}
        onClose={() => setSelectedUserForDetails(null)}
        user={selectedUserForDetails}
      />
    </div>
  );
}
