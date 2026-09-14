import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
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
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: '#64748b', maxWidth: '400px', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        The page you are looking for does not exist.
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
        Go to Home
      </Link>
    </div>
  );
};
