import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  style,
  ...props
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#0284c7',
      color: '#ffffff',
      border: '1px solid #0284c7',
    },
    secondary: {
      backgroundColor: '#f1f5f9',
      color: '#334155',
      border: '1px solid #e2e8f0',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#334155',
      border: '1px solid #cbd5e1',
    },
    danger: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: '1px solid #ef4444',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#64748b',
      border: '1px solid transparent',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '0.375rem 0.625rem',
      fontSize: '0.8125rem',
    },
    md: {
      padding: '0.5rem 0.875rem',
      fontSize: '0.875rem',
    },
    lg: {
      padding: '0.625rem 1.125rem',
      fontSize: '1rem',
    },
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 500,
        borderRadius: '6px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.65 : 1,
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {isLoading && (
        <span
          style={{
            display: 'inline-block',
            width: '0.875rem',
            height: '0.875rem',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
};
