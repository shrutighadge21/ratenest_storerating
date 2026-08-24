import React from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import { ShieldCheck, UserCheck, Store, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DemoBar() {
  const { role, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    if (newRole === 'SYSTEM_ADMIN') {
      navigate('/admin');
    } else if (newRole === 'STORE_OWNER') {
      navigate('/owner');
    } else {
      navigate('/discovery');
    }
  };

  return (
    <div className="bg-primary/95 backdrop-blur-md text-white py-2 px-4 border-b border-gray-800 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-pastel-sage animate-pulse" />
        <span className="font-heading font-semibold tracking-wide text-gray-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pastel-apricot" />
          Interactive Demo Bar:
        </span>
        <span className="text-gray-400 hidden sm:inline">Switch views instantly to evaluate all role experiences</span>
      </div>

      <div className="flex items-center gap-1.5 bg-gray-900/60 p-1 rounded-xl border border-gray-700/60">
        <button
          onClick={() => handleSwitch('NORMAL_USER')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
            role === 'NORMAL_USER'
              ? 'bg-pastel-blue text-primary shadow-sm font-semibold'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Normal User
        </button>
        <button
          onClick={() => handleSwitch('STORE_OWNER')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
            role === 'STORE_OWNER'
              ? 'bg-pastel-apricot text-primary shadow-sm font-semibold'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          Store Owner
        </button>
        <button
          onClick={() => handleSwitch('SYSTEM_ADMIN')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
            role === 'SYSTEM_ADMIN'
              ? 'bg-pastel-sage text-primary shadow-sm font-semibold'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          System Admin
        </button>
      </div>
    </div>
  );
}
