import React from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        border: '1px dashed #cbd5e1',
        borderRadius: '8px',
      }}
    >
      {icon ? (
        <div style={{ color: '#94a3b8', marginBottom: '0.75rem' }}>{icon}</div>
      ) : (
        <div style={{ color: '#94a3b8', marginBottom: '0.75rem' }}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
      )}

      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
        {title}
      </h3>

      {description && (
        <p style={{ fontSize: '0.8125rem', color: '#64748b', maxWidth: '360px', marginBottom: action ? '1rem' : 0 }}>
          {description}
        </p>
      )}

      {action && <div>{action}</div>}
    </div>
  );
};
