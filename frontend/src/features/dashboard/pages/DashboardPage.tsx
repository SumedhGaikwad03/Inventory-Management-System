import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { PageHeader } from '../../../components/layout/PageHeader.tsx';
import { LoadingSpinner } from '../../../components/feedback/LoadingSpinner.tsx';
import { ErrorAlert } from '../../../components/feedback/ErrorAlert.tsx';
import { getErrorMessage } from '../../../api/errorHandler.ts';
import { dashboardApi, type DashboardMetrics } from '../api/dashboardApi.ts';
import { DashboardMetricCard } from '../components/DashboardMetricCard.tsx';
import { LowStockList } from '../components/LowStockList.tsx';
import { RecentActivity } from '../components/RecentActivity.tsx';
import { QuickActions } from '../components/QuickActions.tsx';

export const DashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getDashboardData(isAdmin);
      setMetrics(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.username || 'User'}. Here is your current inventory summary.`}
      />

      {isLoading ? (
        <div className="card">
          <LoadingSpinner message="Loading dashboard overview..." size="md" />
        </div>
      ) : error ? (
        <ErrorAlert
          title="Could not load dashboard data"
          message={error}
          onRetry={fetchDashboardMetrics}
        />
      ) : metrics ? (
        <>
          {/* Top Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
            }}
          >
            <DashboardMetricCard
              title="Total Products"
              value={metrics.totalProducts}
              subtext="Catalog items registered"
              variant="primary"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7.5 4.27 9 5.15" />
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              }
            />

            <DashboardMetricCard
              title="Categories"
              value={metrics.totalCategories}
              subtext="Product classifications"
              variant="default"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
              }
            />

            <DashboardMetricCard
              title="Low Stock Items"
              value={metrics.lowStockCount}
              subtext="Stock quantity ≤ 5 units"
              variant={metrics.lowStockCount > 0 ? 'warning' : 'success'}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              }
            />
          </div>

          {/* Quick Navigation Shortcuts */}
          <QuickActions isAdmin={isAdmin} />

          {/* Low Stock List */}
          <LowStockList items={metrics.lowStockItems} />

          {/* Recent Stock Activity (Admin Only) */}
          {isAdmin && (
            <RecentActivity transactions={metrics.recentTransactions} />
          )}
        </>
      ) : null}
    </div>
  );
};
