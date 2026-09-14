import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Button } from '../ui/Button.tsx';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="app-navbar">
      <div className="navbar-brand-section">
        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="mobile-menu-button"
          onClick={onToggleSidebar}
        >
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
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="brand-logo">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
          <span className="brand-name">Inventory Hub</span>
        </div>
      </div>

      <div className="navbar-user-section">
        {user && (
          <div className="user-profile-badge">
            <span className="user-name">{user.username}</span>
            <Badge variant={isAdmin ? 'primary' : 'default'} size="sm">
              {user.role}
            </Badge>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          title="Sign out of your account"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};
