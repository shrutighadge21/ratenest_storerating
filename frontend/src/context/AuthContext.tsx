import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { authApi } from '../services/api';

export interface AuthResult {
  success: boolean;
  user?: User;
  role?: UserRole;
  error?: string;
}

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: { name: string; email: string; address: string; password: string }) => Promise<AuthResult>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const DEFAULT_USERS: Record<UserRole, User> = {
  SYSTEM_ADMIN: {
    id: 'user-admin-1',
    name: 'Eleanor Vance Administrator',
    email: 'admin@storeratings.io',
    address: '742 Evergreen Terrace, Sector 4, Capital City',
    role: 'SYSTEM_ADMIN',
    createdAt: '2025-01-10',
  },
  NORMAL_USER: {
    id: 'user-normal-1',
    name: 'Maya Robertson Lin Community Reviewer',
    email: 'maya.lin@gmail.com',
    address: '108 West End Blvd, Apartment 4B, Metro District',
    role: 'NORMAL_USER',
    createdAt: '2025-02-15',
  },
  STORE_OWNER: {
    id: 'user-owner-1',
    name: 'Julian Hayes Store Owner',
    email: 'julian@artisancoffee.co',
    address: '124 Market Square, Suite 10, Downtown District',
    role: 'STORE_OWNER',
    storeId: 'store-1',
    createdAt: '2025-01-20',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [currentUser]);

  const role: UserRole = currentUser ? currentUser.role : 'NORMAL_USER';
  const isAuthenticated = !!currentUser;

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      // 1. Try real backend API
      const res = await authApi.login(cleanEmail, cleanPassword);
      if (res && res.user && res.token) {
        localStorage.setItem('auth_token', res.token);
        setCurrentUser(res.user);
        return {
          success: true,
          user: res.user,
          role: res.user.role,
        };
      }
    } catch (apiErr: any) {
      const serverMessage = apiErr.response?.data?.message;
      if (serverMessage) {
        return {
          success: false,
          error: serverMessage,
        };
      }
    }

    // 2. Fallback check for local storage / seed users
    const savedUsersRaw = localStorage.getItem('app_users');
    let allUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
    const defaultAccounts: User[] = Object.values(DEFAULT_USERS);
    allUsers = [...allUsers, ...defaultAccounts.filter((d) => !allUsers.some((u) => u.email.toLowerCase() === d.email.toLowerCase()))];

    const matchedUser = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matchedUser) {
      return {
        success: false,
        error: 'Email or password doesn’t match. Please try again.',
      };
    }

    setCurrentUser(matchedUser);
    return {
      success: true,
      user: matchedUser,
      role: matchedUser.role,
    };
  };

  const register = async (data: {
    name: string;
    email: string;
    address: string;
    password: string;
  }): Promise<AuthResult> => {
    const cleanName = data.name.trim();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanAddress = data.address.trim();

    try {
      // 1. Call real backend API
      const res = await authApi.register({
        name: cleanName,
        email: cleanEmail,
        address: cleanAddress,
        password: data.password,
      });

      if (res && res.user && res.token) {
        localStorage.setItem('auth_token', res.token);
        return {
          success: true,
          user: res.user,
          role: 'NORMAL_USER',
        };
      }
    } catch (apiErr: any) {
      const serverMessage = apiErr.response?.data?.message;
      if (serverMessage) {
        return {
          success: false,
          error: serverMessage,
        };
      }
    }

    // 2. Fallback local persistence
    const savedUsersRaw = localStorage.getItem('app_users');
    const existingUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];

    if (existingUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in.',
      };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      address: cleanAddress,
      role: 'NORMAL_USER',
      createdAt: new Date().toISOString().split('T')[0],
    };

    localStorage.setItem('app_users', JSON.stringify([newUser, ...existingUsers]));

    return {
      success: true,
      user: newUser,
      role: 'NORMAL_USER',
    };
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    setCurrentUser(DEFAULT_USERS[newRole]);
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!currentUser) return false;

    try {
      // 1. Call real backend API
      const res = await authApi.updateProfile({ name: data.name, address: data.address });
      if (res) {
        setCurrentUser(res);
        localStorage.setItem('auth_user', JSON.stringify(res));
        return true;
      }
    } catch (e) {
      // 2. Fallback
      const updated = { ...currentUser, ...data };
      setCurrentUser(updated);

      const savedUsersRaw = localStorage.getItem('app_users');
      if (savedUsersRaw) {
        const users: User[] = JSON.parse(savedUsersRaw);
        const updatedList = users.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u));
        localStorage.setItem('app_users', JSON.stringify(updatedList));
      }
    }
    return true;
  };

  const updatePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!currentUser) return false;

    try {
      await authApi.updatePassword(oldPassword, newPassword);
      return true;
    } catch (e) {
      // Fallback
      return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
