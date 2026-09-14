import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Badge } from '../ui/Badge.tsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      to: '/products',
      label: 'Products',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7.5 4.27 9 5.15" />
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
    },
    {
      to: '/categories',
      label: 'Categories',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      ),
    },
    ...(isAdmin
      ? [
          {
            to: '/transactions',
            label: 'Transactions',
            adminOnly: true,
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 3h5v5" />
                <path d="m21 3-7 7" />
                <path d="m21 14-5 5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                <path d="M8 21v-4" />
                <path d="M12 21v-7" />
              </svg>
            ),
          },
        ]
      : []),
  ];

  return (
    <aside className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header-mobile">
        <span className="sidebar-title">Menu</span>
        <button
          type="button"
          aria-label="Close menu"
          className="sidebar-close-button"
          onClick={onClose}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
            onClick={onClose}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.adminOnly && (
              <Badge variant="primary" size="sm">
                Admin
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-version-tag">
          Inventory API v1.0
        </div>
      </div>
    </aside>
  );
};
