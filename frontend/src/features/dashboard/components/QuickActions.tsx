import React from 'react';
import { Link } from 'react-router-dom';

interface QuickActionsProps {
  isAdmin: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ isAdmin }) => {
  return (
    <div className="card">
      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>
        Quick Actions
      </h2>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.875rem',
            backgroundColor: '#f1f5f9',
            color: '#334155',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: '1px solid #e2e8f0',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          </svg>
          Browse Products
        </Link>

        <Link
          to="/categories"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.875rem',
            backgroundColor: '#f1f5f9',
            color: '#334155',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: '1px solid #e2e8f0',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
          </svg>
          Manage Categories
        </Link>

        {isAdmin && (
          <Link
            to="/transactions"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: '1px solid #bae6fd',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5" />
              <path d="m21 3-7 7" />
              <path d="m21 14-5 5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
            </svg>
            Audit Transactions
          </Link>
        )}
      </div>
    </div>
  );
};
