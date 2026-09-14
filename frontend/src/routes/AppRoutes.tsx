import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.tsx';
import { RoleRoute } from './RoleRoute.tsx';
import { PublicRoute } from './PublicRoute.tsx';
import { AppLayout } from '../components/layout/AppLayout.tsx';
import { LoginPage } from '../features/auth/pages/LoginPage.tsx';
import { SignupPage } from '../features/auth/pages/SignupPage.tsx';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage.tsx';
import { ProductsPage } from '../features/products/pages/ProductsPage.tsx';
import { CategoriesPage } from '../features/categories/pages/CategoriesPage.tsx';
import { TransactionsPage } from '../features/transactions/pages/TransactionsPage.tsx';
import { UnauthorizedPage } from '../pages/UnauthorizedPage.tsx';
import { NotFoundPage } from '../pages/NotFoundPage.tsx';

// this is tecnically the central routing map of the react application 

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes (redirects to / if already logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Authenticated routes wrapped inside AppLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />

          {/* Admin-only restricted routes  role route applies for transation page */}
          <Route element={<RoleRoute requiredRole="Admin" />}>
            <Route path="/transactions" element={<TransactionsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Error / Fallback routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
