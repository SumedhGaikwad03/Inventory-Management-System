import React from 'react';
import { Link } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.5rem' }}>
        403 - Access Denied
      </h1>
      <p style={{ color: '#475569', maxWidth: '400px', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        You do not have administrative permissions to view this resource.
      </p>
      <Link
        to="/"
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#0284c7',
          color: '#ffffff',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        Return to Home
      </Link>
    </div>
  );
};
