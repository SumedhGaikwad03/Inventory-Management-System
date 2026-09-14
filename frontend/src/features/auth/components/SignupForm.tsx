import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/authApi.ts';
import { getErrorMessage } from '../../../api/errorHandler.ts';

export const SignupForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
      setError('Username must be between 3 and 50 characters.');
      return;
    }

    if (password.length < 8 || password.length > 100) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.signup({
        username: trimmedUsername,
        email: trimmedEmail,
        password,
      });

      setSuccess('Account created successfully! You can now log in with your credentials.');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
        <div
          role="status"
          style={{
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '6px',
            color: '#166534',
            fontSize: '0.875rem',
            lineHeight: '1.4',
          }}
        >
          {success}
        </div>

        <Link
          to="/login"
          style={{
            display: 'inline-block',
            padding: '0.625rem 1rem',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            fontWeight: 500,
            fontSize: '0.875rem',
            borderRadius: '6px',
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          Proceed to Sign In
        </Link>
      </div>
    );
  }

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
          htmlFor="signup-username"
          style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
        >
          Username <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
          id="signup-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isSubmitting}
          required
          autoComplete="username"
          placeholder="e.g. jdoe"
          minLength={3}
          maxLength={50}
          style={{
            padding: '0.625rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
            outline: 'none',
          }}
        />
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Minimum 3 characters</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label
          htmlFor="signup-email"
          style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
        >
          Email Address <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
          autoComplete="email"
          placeholder="e.g. jdoe@example.com"
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
          htmlFor="signup-password"
          style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
        >
          Password <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          minLength={8}
          maxLength={100}
          style={{
            padding: '0.625rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
            outline: 'none',
          }}
        />
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Minimum 8 characters</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label
          htmlFor="signup-confirm-password"
          style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
        >
          Confirm Password <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          minLength={8}
          maxLength={100}
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
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
};
