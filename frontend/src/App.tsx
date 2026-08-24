import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StoreDiscoveryPage } from './pages/StoreDiscoveryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { StoreOwnerDashboardPage } from './pages/StoreOwnerDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Normal User Routes */}
              <Route 
                path="/discovery" 
                element={
                  <ProtectedRoute allowedRoles={['NORMAL_USER']}>
                    <StoreDiscoveryPage />
                  </ProtectedRoute>
                } 
              />

              {/* System Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />

              {/* Store Owner Routes */}
              <Route path="/owner" element={<Navigate to="/store-owner" replace />} />
              <Route 
                path="/store-owner" 
                element={
                  <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                    <StoreOwnerDashboardPage />
                  </ProtectedRoute>
                } 
              />

              {/* Shared Protected Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
