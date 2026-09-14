import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm.tsx';

export const LoginPage: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: '#0f172a' }}>
            Inventory System
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Sign in to access your inventory account
          </p>
        </div>

        <LoginForm />

        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f1f5f9',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#64748b',
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#0284c7',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};
