'use client';

import React, { memo } from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
};

const getIconElement = (iconName: string) => {
  // Simple implementation - in a real app you might use an icon library
  switch (iconName) {
    case 'users':
      return '👥';
    case 'money':
      return '💰';
    case 'briefcase':
      return '💼';
    case 'check':
      return '✅';
    default:
      return '📊';
  }
};

const StatCard = ({ title, value, change, trend, icon }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <span className="text-2xl">{getIconElement(icon)}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          trend === 'up' ? 'bg-green-100 text-green-800' :
          trend === 'down' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {change > 0 ? `+${change}%` : `${change}%`}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default memo(StatCard);
