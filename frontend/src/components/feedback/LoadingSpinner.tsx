import React from 'react';

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md',
}) => {
  const sizePixels = {
    sm: '1rem',
    md: '1.75rem',
    lg: '2.5rem',
  }[size];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem',
        gap: '0.75rem',
        color: '#64748b',
        fontSize: '0.875rem',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: sizePixels,
          height: sizePixels,
          border: '3px solid #e2e8f0',
          borderTopColor: '#0284c7',
          borderRadius: '50%',
          animation: 'spin 0.75s linear infinite',
        }}
      />
      {message && <span>{message}</span>}
    </div>
  );
};
