import React from 'react';
import { Link } from 'react-router-dom';
import type { InventoryTransactionResponseDto } from '../../../types/index.ts';
import { formatDate } from '../../../utils/formatters.ts';
import { Badge } from '../../../components/ui/Badge.tsx';
import { EmptyState } from '../../../components/feedback/EmptyState.tsx';

interface RecentActivityProps {
  transactions: InventoryTransactionResponseDto[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ transactions }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
            Recent Stock Activity
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.125rem' }}>
            Latest inventory movements and stock adjustments
          </p>
        </div>

        <Link
          to="/transactions"
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#0284c7',
            textDecoration: 'none',
          }}
        >
          View Full Audit Log →
        </Link>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No Transactions Recorded"
          description="No recent inventory stock adjustments have been recorded."
        />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '0.625rem 0.75rem', fontWeight: 600 }}>Product</th>
                <th style={{ padding: '0.625rem 0.75rem', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '0.625rem 0.75rem', fontWeight: 600 }}>Change</th>
                <th style={{ padding: '0.625rem 0.75rem', fontWeight: 600 }}>User</th>
                <th style={{ padding: '0.625rem 0.75rem', fontWeight: 600, textAlign: 'right' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const isPositive = tx.quantityChanged > 0;
                return (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 500, color: '#0f172a' }}>
                      {tx.productName}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <Badge variant="default" size="sm">
                        {tx.transactionType}
                      </Badge>
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        fontWeight: 600,
                        color: isPositive ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {isPositive ? `+${tx.quantityChanged}` : tx.quantityChanged}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#475569' }}>
                      {tx.username}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#64748b', textAlign: 'right', fontSize: '0.8125rem' }}>
                      {formatDate(tx.createdDate)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
