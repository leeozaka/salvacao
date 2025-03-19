'use client';

import React, { memo } from 'react';

const SidebarHeader = () => {
  return (
    <div className="p-4 border-b border-gray-800">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
          <span className="font-bold text-xl">A</span>
        </div>
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </div>
    </div>
  );
};

export default memo(SidebarHeader);
