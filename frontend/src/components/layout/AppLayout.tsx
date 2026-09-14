import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.tsx';
import { Sidebar } from './Sidebar.tsx';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-container">
      <Navbar onToggleSidebar={toggleSidebar} />

      <div className="app-body">
        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="app-main-content">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
