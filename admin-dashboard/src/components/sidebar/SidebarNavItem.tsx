'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarNavItemProps = {
  icon: string;
  label: string;
  href: string;
};

const getIconElement = (iconName: string) => {
  switch (iconName) {
    case 'home':
      return '🏠';
    case 'users':
      return '👥';
    case 'chart-bar':
      return '📊';
    case 'document':
      return '📄';
    case 'cog':
      return '⚙️';
    default:
      return '•';
  }
};

const SidebarNavItem = ({ icon, label, href }: SidebarNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <li>
      <Link 
        href={href}
        className={`flex items-center p-2 rounded-md transition-colors ${
          isActive 
            ? 'bg-blue-700 text-white' 
            : 'text-gray-300 hover:bg-gray-800'
        }`}
      >
        <span className="mr-3 text-lg">{getIconElement(icon)}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default memo(SidebarNavItem);
