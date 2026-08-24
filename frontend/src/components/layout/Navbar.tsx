import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Star, Compass, LayoutDashboard, Store, User, LogOut } from 'lucide-react';

export function Navbar() {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return <span className="text-xs px-2.5 py-1 rounded-full bg-brand/10 text-brand font-semibold">Admin</span>;
      case 'STORE_OWNER':
        return <span className="text-xs px-2.5 py-1 rounded-full bg-brandSecondary/10 text-brandSecondary font-semibold">Store Owner</span>;
      default:
        return <span className="text-xs px-2.5 py-1 rounded-full bg-pastel-blue text-primary font-semibold">Reviewer</span>;
    }
  };

  const getHomeRoute = () => {
    if (role === 'SYSTEM_ADMIN') return '/admin';
    if (role === 'STORE_OWNER') return '/store-owner';
    return '/discovery';
  };

  return (
    <nav className="border-b border-borderSoft/80 bg-white/80 backdrop-blur-md sticky top-[0px] z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to={getHomeRoute()} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-primary text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
            <Star className="w-4 h-4 fill-pastel-apricot text-pastel-apricot" />
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-primary tracking-tight">Rate</span>
            <span className="font-heading font-medium text-lg text-muted">Nest</span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {role === 'NORMAL_USER' && (
            <Link
              to="/discovery"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/discovery' ? 'bg-pastel-blue/60 text-primary font-semibold' : 'text-muted hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Discover Stores
            </Link>
          )}

          {role === 'STORE_OWNER' && (
            <Link
              to="/store-owner"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/store-owner' ? 'bg-pastel-apricot/60 text-primary font-semibold' : 'text-muted hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Store className="w-4 h-4" />
              My Store Dashboard
            </Link>
          )}

          {role === 'SYSTEM_ADMIN' && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname.startsWith('/admin') ? 'bg-pastel-sage/60 text-primary font-semibold' : 'text-muted hover:text-primary hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Operations
            </Link>
          )}

          <Link
            to="/profile"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === '/profile' ? 'bg-gray-100 text-primary font-semibold' : 'text-muted hover:text-primary hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" />
            Settings
          </Link>
        </div>

        {/* User profile & logout */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-heading font-semibold text-primary leading-tight">{currentUser.name}</span>
                <span className="text-xs text-muted">{currentUser.email}</span>
              </div>
              {getRoleBadge()}
              <div className="w-9 h-9 rounded-2xl bg-pastel-blue/70 border border-brand/20/50 flex items-center justify-center font-heading font-bold text-sm text-primary shadow-soft">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-2 rounded-xl text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
