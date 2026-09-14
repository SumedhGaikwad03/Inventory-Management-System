import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      borderColor: '#e2e8f0',
    },
    primary: {
      backgroundColor: '#e0f2fe',
      color: '#0369a1',
      borderColor: '#bae6fd',
    },
    success: {
      backgroundColor: '#dcfce7',
      color: '#15803d',
      borderColor: '#bbf7d0',
    },
    warning: {
      backgroundColor: '#fef3c7',
      color: '#b45309',
      borderColor: '#fde68a',
    },
    danger: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderColor: '#fca5a5',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '0.125rem 0.5rem',
      fontSize: '0.75rem',
    },
    md: {
      padding: '0.25rem 0.75rem',
      fontSize: '0.8125rem',
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: 600,
        borderRadius: '9999px',
        border: '1px solid transparent',
        lineHeight: 1.25,
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
};
