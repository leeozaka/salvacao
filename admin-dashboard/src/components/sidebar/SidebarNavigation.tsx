'use client';

import React, { memo } from 'react';
import SidebarNavItem from './SidebarNavItem';

const navItems = [
  { icon: 'home', label: 'Dashboard', href: '/dashboard' },
  { icon: 'users', label: 'Users', href: '/dashboard/users' },
  { icon: 'chart-bar', label: 'Analytics', href: '/dashboard/analytics' },
  { icon: 'document', label: 'Reports', href: '/dashboard/reports' },
  { icon: 'cog', label: 'Settings', href: '/dashboard/settings' },
];

const SidebarNavigation = () => {
  return (
    <nav className="flex-grow p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <SidebarNavItem 
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
          />
        ))}
      </ul>
    </nav>
  );
};

// Using memo to avoid re-rendering
export default memo(SidebarNavigation);
