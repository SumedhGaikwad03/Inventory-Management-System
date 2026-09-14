import React from 'react';

export interface DashboardMetricCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'warning' | 'primary' | 'success';
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  value,
  subtext,
  icon,
  variant = 'default',
}) => {
  const iconColor = {
    default: '#64748b',
    primary: '#0284c7',
    warning: '#d97706',
    success: '#16a34a',
  }[variant];

  const iconBg = {
    default: '#f1f5f9',
    primary: '#e0f2fe',
    warning: '#fef3c7',
    success: '#dcfce7',
  }[variant];

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '3.25rem',
          height: '3.25rem',
          borderRadius: '8px',
          backgroundColor: iconBg,
          color: iconColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2, marginTop: '0.125rem' }}>
          {value}
        </div>
        {subtext && (
          <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};
