import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductResponseDto } from '../../../types/index.ts';
import { formatCurrency } from '../../../utils/formatters.ts';
import { Badge } from '../../../components/ui/Badge.tsx';
import { EmptyState } from '../../../components/feedback/EmptyState.tsx';

interface LowStockListProps {
  items: ProductResponseDto[];
}

export const LowStockList: React.FC<LowStockListProps> = ({ items }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
            Low Stock Alerts
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.125rem' }}>
            Products with 5 units or fewer remaining in inventory
          </p>
        </div>

        <Link
          to="/products"
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#0284c7',
            textDecoration: 'none',
          }}
        >
          View All Products →
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Stock Levels Healthy"
          description="No products currently have low stock (5 or fewer units)."
          icon={
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
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
                <th style={{ padding: '0.625rem 0.75rem', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '0.625rem 0.75rem', fontWeight: 600 }}>Price</th>
                <th style={{ padding: '0.625rem 0.75rem', fontWeight: 600, textAlign: 'right' }}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {items.map((product) => (
                <tr
                  key={product.id}
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                >
                  <td style={{ padding: '0.75rem', fontWeight: 500, color: '#0f172a' }}>
                    {product.name}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#475569' }}>
                    {product.categoryName || 'Uncategorized'}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#475569' }}>
                    {formatCurrency(product.price)}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <Badge variant={product.quantity === 0 ? 'danger' : 'warning'}>
                      {product.quantity} left
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
