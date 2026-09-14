import React from 'react';
import { Button } from '../ui/Button.tsx';

export interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Unable to load data',
  message,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      style={{
        padding: '1.25rem',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        color: '#991b1b',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{title}</span>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#7f1d1d', margin: 0 }}>
        {message}
      </p>

      {onRetry && (
        <div>
          <Button variant="danger" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
