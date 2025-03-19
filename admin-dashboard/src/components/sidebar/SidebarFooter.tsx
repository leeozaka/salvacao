'use client';

import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/services/authService';

const SidebarFooter = () => {
  const router = useRouter();
  
  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      router.push('/login');
    }
  };
  
  return (
    <div className="p-4 border-t border-gray-800">
      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center p-2 text-sm text-gray-300 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
      >
        <span className="mr-2">🚪</span>
        Logout
      </button>
    </div>
  );
};

export default memo(SidebarFooter);
