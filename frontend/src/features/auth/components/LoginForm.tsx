import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.tsx';
import { getErrorMessage } from '../../../api/errorHandler.ts';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigate to previous location or dashboard after successful login
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await login({ username: username.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && (
        <div
          role="alert"
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '6px',
            color: '#b91c1c',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label
          htmlFor="username"
          style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isSubmitting}
          required
          autoComplete="username"
          style={{
            padding: '0.625rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label
          htmlFor="password"
          style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
          autoComplete="current-password"
          style={{
            padding: '0.625rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
            outline: 'none',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          marginTop: '0.5rem',
          padding: '0.625rem 1rem',
          backgroundColor: isSubmitting ? '#94a3b8' : '#0284c7',
          color: '#ffffff',
          fontWeight: 500,
          fontSize: '0.875rem',
          border: 'none',
          borderRadius: '6px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};
